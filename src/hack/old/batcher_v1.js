/** 
 * @param {NS} ns 
 * @param {string} server
*/
function getServerRam(ns) {
	return ns.getServer().maxRam - ns.getServer().ramUsed;
}

/** @param {NS} ns */
export async function main(ns) {
	// check for arguments
	if (ns.args.length < 2) {
		ns.tprint("Not enough arguments");
		return;
	}
	let server = ns.args[0];
	let port = parseInt(ns.args[1]);
	let host_server = ns.getServer().hostname
	
	// disable default logs
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("scp");
	ns.disableLog("killall");
	ns.disableLog("sleep");
	ns.disableLog("exec");
	ns.disableLog("getHackingLevel");
	ns.clearLog();
	ns.print("Script start");

	// first make sure that security is lowest and money is highest
	let min_security = ns.getServerMinSecurityLevel(server);
	let max_money = ns.getServerMaxMoney(server);
	if (ns.getServerSecurityLevel(server) > min_security) {
		ns.tprint("Server needs to be weakened more");
		return;
	}
	if (ns.getServerMoneyAvailable(server) < max_money) {
		ns.tprint("Server needs to be grown more");
		return;
	}

	// copy the files over
	let hack_script = "/hack/wait_hack.js"
	let grow_script = "/hack/wait_grow.js"
	let weaken_script = "/hack/wait_weaken.js"
	await ns.scp([hack_script, grow_script, weaken_script], host_server, "home");

	// kill anything running before
	ns.killall(host_server, true);

	// the security decreased by a single weaken thread (this is fixed and does not decrease per hacking level)
	let weaken_security_dec = 0.05;

	// unique identifier for each batch
	let id = 0;
	// gap between operations
	let gap = 2;
	// thread vars
	let hack_threads, hack_security_inc, weaken_1_threads, grow_threads, grow_security_inc, weaken_2_threads, ram_per_batch;
	// script times
	let hack_time, grow_time, weaken_1_time, weaken_2_time, max_time;
	// hack level to refresh times
	// let hack_level = 0;
	// server object
	let server_obj = ns.getServer(server);
	
	// initial calc of threads required for grow
	grow_threads = Math.ceil(ns.growthAnalyze(server, 2));

	while (true) {
		// keep a gap of gap*4s minimum between batches
		await ns.sleep(gap * 4 * 1000);

		// // need to update thread and timings if hacking level increases
		// while (hack_level !== ns.getHackingLevel()) {
		// 	// kills all hack scripts because timings will no longer be consistent
		// 	ns.scriptKill(hack_script, server);
			
		// 	// can only update script threads and times if security is min and money is max
		// 	if (ns.getServerSecurityLevel(server) === min_security && ns.getServerMoneyAvailable(server) === max_money) {			
		// 		// the hack threads for stealing <= 50% money and their security increase
		// 		hack_threads = Math.floor(ns.hackAnalyzeThreads(server, max_money * 0.5));
		// 		hack_security_inc = 0.002 * hack_threads; //ns.hackAnalyzeSecurity(hack_threads, server);

		// 		// the number of weaken threads required to offset hack increase
		// 		weaken_1_threads = Math.ceil(hack_security_inc / weaken_security_dec);

		// 		// the number of threads needed to double the money back to 100% and their security increase
		// 		grow_threads = Math.ceil(ns.growthAnalyze(server, 2));
		// 		grow_security_inc = 0.004 * grow_threads; //ns.growthAnalyzeSecurity(grow_threads, server, 1);

		// 		// the number of weaken threads required to offset hack increase
		// 		weaken_2_threads = Math.ceil(grow_security_inc / weaken_security_dec);

		// 		// hack, weaken, grow, weaken
		// 		ram_per_batch = (1.70 * hack_threads) + (1.75 * weaken_1_threads) + (1.75 * grow_threads) + (1.75 * weaken_2_threads); 

		// 		// update script timings
		// 		hack_time = ns.getHackTime(server);
		// 		grow_time = ns.getGrowTime(server);
		// 		weaken_time = ns.getWeakenTime(server);
		// 		max_time = Math.max(hack_time, grow_time, weaken_time);

		// 		// finally, update hacking level
		// 		hack_level = ns.getHackingLevel();

		// 		ns.writePort(port, "Updated timings and threads");
		// 	}

		// 	// wait for some small time before trying again
		// 	await ns.sleep(200);
		// }

		// // the hack threads for stealing <= 50% money and their security increase
		// server_obj.moneyAvailable = server_obj.moneyMax;
		// server_obj.hackDifficulty = server_obj.minDifficulty;
		// hack_time = ns.formulas.hacking.hackTime(server_obj, ns.getPlayer());
		// hack_threads = Math.floor((1 / ns.formulas.hacking.hackPercent(server_obj, ns.getPlayer())) * 0.5);
		// hack_security_inc = 0.002 * hack_threads; //ns.hackAnalyzeSecurity(hack_threads, server);

		// // the number of weaken threads required to offset hack security increase
		// server_obj.hackDifficulty = server_obj.minDifficulty + hack_security_inc;
		// weaken_1_time = ns.formulas.hacking.weakenTime(server_obj, ns.getPlayer());
		// weaken_1_threads = Math.ceil(hack_security_inc / weaken_security_dec);

		// // the number of threads needed to double the money back to 100% and their security increase		
		// server_obj.moneyAvailable = server_obj.moneyMax * 0.5;
		// server_obj.hackDifficulty = server_obj.minDifficulty;
		// grow_time = ns.formulas.hacking.growTime(server_obj, ns.getPlayer());
		// // decrease threads until we reach optimal
		// while (ns.formulas.hacking.growPercent(server_obj, grow_threads-1, ns.getPlayer(), 1) >= 2) {
		// 	grow_threads -= 1;
		// }
		// grow_security_inc = 0.004 * grow_threads; //ns.growthAnalyzeSecurity(grow_threads, server, 1);

		// // the number of weaken threads required to offset hack increase
		// server_obj.moneyAvailable = server_obj.moneyMax;
		// server_obj.hackDifficulty = server_obj.minDifficulty + grow_security_inc;
		// weaken_2_time = ns.formulas.hacking.weakenTime(server_obj, ns.getPlayer());
		// weaken_2_threads = Math.ceil(grow_security_inc / weaken_security_dec);

		// // hack, weaken, grow, weaken
		// ram_per_batch = (1.70 * hack_threads) + (1.75 * weaken_1_threads) + (1.75 * grow_threads) + (1.75 * weaken_2_threads); 

		// // update script timings
		// max_time = Math.max(hack_time, grow_time, weaken_1_time, weaken_2_time);

		// the hack threads for stealing <= 50% money and their security increase
		hack_threads = Math.floor(ns.hackAnalyzeThreads(server, max_money * 0.5));
		hack_security_inc = 0.002 * hack_threads; //ns.hackAnalyzeSecurity(hack_threads, server);

		// the number of weaken threads required to offset hack increase
		weaken_1_threads = Math.ceil(hack_security_inc / weaken_security_dec);

		// the number of threads needed to double the money back to 100% and their security increase
		grow_threads = Math.ceil(ns.growthAnalyze(server, 2));
		grow_security_inc = 0.004 * grow_threads; //ns.growthAnalyzeSecurity(grow_threads, server, 1);

		// the number of weaken threads required to offset hack increase
		weaken_2_threads = Math.ceil(grow_security_inc / weaken_security_dec);

		// hack, weaken, grow, weaken
		ram_per_batch = (1.70 * hack_threads) + (1.75 * weaken_1_threads) + (1.75 * grow_threads) + (1.75 * weaken_2_threads); 

		// update script timings
		hack_time = ns.getHackTime(server);
		grow_time = ns.getGrowTime(server);
		weaken_time = ns.getWeakenTime(server);
		max_time = Math.max(hack_time, grow_time, weaken_time);



				
		// wait until enough ram is available for a batch
		// if not satisfied, start from top
		if (getServerRam(ns) < ram_per_batch) {
			continue;
		}

		// My logs
		ns.print("id:", id);
		ns.print("hack_threads:", hack_threads, " hack_security_inc:", hack_security_inc);
		ns.print("weaken_1_threads:", weaken_1_threads);
		ns.print("grow_threads:", grow_threads, " grow_security_inc:", grow_security_inc);
		ns.print("weaken_2_threads:", weaken_2_threads);
		ns.print("ram_per_batch:", ram_per_batch);
		ns.print("hack_time:", hack_time, " grow_time:", grow_time, " weaken_1_time:", weaken_1_time, " weaken_2_time:", weaken_2_time, " max_time:", max_time);
		// ns.print("hack_level:", hack_level);
		ns.print(" ");

		// hack should end at the max possible time it takes any of the scripts to run
		let ts = max_time;
		// first hack should run
		// setTimeout(ns.exec, ts - hack_time, hack_script, host_server, hack_threads, server, ts - hack_time, id);
		ns.exec(hack_script, host_server, hack_threads, server, ts - hack_time, id, port);
		ts += (gap * 1000)
		// then after <gap> seconds, weaken
		// setTimeout(ns.exec, ts - weaken_time, weaken_script, host_server, weaken_1_threads, server, ts - weaken_time, id);
		ns.exec(weaken_script, host_server, weaken_1_threads, server, ts - weaken_1_time, id, port);
		ts += (gap * 1000)
		// then after <gap> seconds, grow
		// setTimeout(ns.exec, ts - grow_time, grow_script, host_server, grow_threads, server, ts - grow_time, id);
		ns.exec(grow_script, host_server, grow_threads, server, ts - grow_time, id, port);
		ts += (gap * 1000)
		// then after <gap> seconds, weaken again
		// setTimeout(ns.exec, ts - weaken_time, weaken_script, host_server, weaken_2_threads, server, ts - weaken_time, id);
		ns.exec(weaken_script, host_server, weaken_2_threads, server, ts - weaken_2_time, id, port);

		// increase id
		id++;
	}
}