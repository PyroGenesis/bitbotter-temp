/** 
 * @param {NS} ns 
*/
function printArgs(ns) {
	ns.tprint("Arguments needed for weaken_once.js");
	ns.tprint("server    Server to hack");
	ns.tprint("id        Unique identifier to be able to run duplicates");
	ns.tprint("port      Optional. Port to out details on");
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
		ns.print("Not enough arguments");
		return;
	}
	let server = ns.args[0];
	let id = ns.args[1];
	let port = null;
	if (ns.args.length > 2) {
		port = parseInt(ns.args[2]);
	}

	await ns.weaken(server);
	if (port !== null) {
		await ns.writePort(port, `Finished weaken ${id}`);
	}
}