const batcher_script = "/hack/batcher.js";
const dispatch_script = "/hack/dispatcher.js";
const hack_script = "/hack/hack_once.js";
const grow_script = "/hack/grow_once.js";
const weaken_script = "/hack/weaken_once.js";

const JOB_SPACER = 500;
const BATCH_SPACER = 500;
const GROW_PER_WEAKEN = 12;

/** 
 * @param {NS} ns 
*/
function getServerAvailableRam(ns) {
	return ns.getServer().maxRam - ns.getServer().ramUsed;
}

/** 
 * @param {NS} ns 
*/
function printArgs(ns) {
	ns.tprint("Arguments needed for preparer.js");
	ns.tprint("server    Server to hack");
	ns.tprint("port      Port to out details on");
}

/** @param {NS} ns */
export async function main(ns) {
	// help
	if (ns.args.length === 1 && ns.args[0] === 'help') {
		printArgs(ns);
		return;
	}

	// check for arguments
	if (ns.args.length < 2) {
		ns.tprint("Not enough arguments");
		return;
	}
	let server = ns.args[0];
	let port = parseInt(ns.args[1]);
	let host_server = ns.getServer().hostname
	
	// disable default logs
	// ns.disableLog("getServerMinSecurityLevel");
	// ns.disableLog("getServerMaxMoney");
	// ns.disableLog("getServerSecurityLevel");
	// ns.disableLog("getServerMoneyAvailable");
	// ns.disableLog("scp");
	// ns.disableLog("killall");
	// ns.disableLog("sleep");
	// ns.disableLog("exec");
	// ns.disableLog("getHackingLevel");
	ns.clearLog();
	ns.print("Script start");

	// kill anything running before
	ns.killall(host_server, true);

	// copy over the relevant scripts
	ns.scp([batcher_script, hack_script, grow_script, weaken_script], host_server, "home");

	// unique identifier for each batch
	let id = 0;
	let min_security = ns.getServerMinSecurityLevel(server);
	let max_money = ns.getServerMaxMoney(server);

	while (ns.getServerSecurityLevel(server) > min_security || ns.getServerMoneyAvailable(server) < max_money) {
		// first try to reduce security if greater than min
		if (ns.getServerSecurityLevel(server) > min_security) {
			let weak_threads_needed = Math.ceil((ns.getServerSecurityLevel(server) - min_security) / 0.05);
			let weak_threads_possible = Math.floor(getServerAvailableRam(ns) / 1.75);
			let weak_threads = Math.min(weak_threads_needed, weak_threads_possible);

			await ns.writePort(port, `Running ${weak_threads} weakens`);
			ns.exec(weaken_script, host_server, weak_threads, server, id);
		} else {
			// grow weaken batch
			let jobs = GROW_PER_WEAKEN + 1
			let ram_per_batch = jobs * 1.75;
			let batches = Math.floor(getServerAvailableRam(ns) / ram_per_batch);
			
			await ns.writePort(port, `Running ${batches} batches of grow-weaken`);
			ns.exec(grow_script, host_server, batches * GROW_PER_WEAKEN, server, id);
			ns.exec(weaken_script, host_server, batches, server, id);
		}

		// wait until everything is done
		while (ns.ps().length > 1) {
			await ns.sleep(1000);
		}
		// Increment id
		id++;

		// safety sleep
		await ns.sleep(5000);
	}

	// run the batcher
	ns.spawn(batcher_script, 1, server, port)
}