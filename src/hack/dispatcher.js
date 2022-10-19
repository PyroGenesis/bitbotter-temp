/** @param {NS} ns */
export async function main(ns) {
	let start = Date.now();

	// check for arguments
	if (ns.args.length < 10) {
		ns.print("Not enough arguments");
		return;
	}
	let server = ns.args[0];
	let host_server = ns.args[1];
	let id = ns.args[2];
	let port = parseInt(ns.args[3]);

	let hack_threads = parseInt(ns.args[4]);
	let weaken_1_threads = parseInt(ns.args[5]);
	let grow_threads = parseInt(ns.args[6]);
	let weaken_2_threads = parseInt(ns.args[7]);

	let JOB_SPACER = parseInt(ns.args[8]);
	// let weaken_time = parseFloat(ns.args[9]);

	// let hack_level_at_launch = ns.getHackingLevel();
	let hack_time = ns.getHackTime(server);
	let grow_time = ns.getGrowTime(server);
	let weaken_time = ns.getWeakenTime(server);

	let hack_end = weaken_time - JOB_SPACER;
	let weaken_1_end = weaken_time;
	let grow_end = weaken_1_end + JOB_SPACER;
	let weaken_2_end = grow_end + JOB_SPACER;

	let hack_start = hack_end - hack_time;
	let weaken_1_start = weaken_1_end - weaken_time;
	let grow_start = grow_end - grow_time;
	let weaken_2_start = weaken_2_end - weaken_time;

	// ns.disableLog("sleep");
	ns.clearLog();
	ns.print("Script start");

	let hack_script = "/hack/hack_once.js";
	let grow_script = "/hack/grow_once.js";
	let weaken_script = "/hack/weaken_once.js";
	// let LAUNCH_SPACER = JOB_SPACER / 2;

	let hack_PID = null;
	let weaken_1_PID = null;
	let grow_PID = null;
	let weaken_2_PID = null;

	// let skip_sleep = true;	
	let time_passed = null;
	// while (hack_PID === null || weaken_1_PID === null || grow_PID === null || weaken_2_PID === null) {
	// 	if (!skip_sleep) {
	// 		await ns.sleep(LAUNCH_SPACER);
	// 	} else {
	// 		skip_sleep = false;
	// 	}

	// 	time_passed = Date.now() - start;
	// 	let time_left_before_hack_start = hack_end - (ns.getHackTime(server) + time_passed);
	// 	ns.print("time_left_before_hack_start: ", time_left_before_hack_start);
	// 	if (hack_PID === null && time_left_before_hack_start <= LAUNCH_SPACER) {
	// 		if (time_left_before_hack_start > 0) {
	// 			await ns.sleep(time_left_before_hack_start);
	// 			skip_sleep = true;
	// 		}
	// 		hack_PID = ns.exec(hack_script, host_server, hack_threads, server, id, port);
	// 	}

	// 	time_passed = Date.now() - start;
	// 	let time_left_before_weaken_1_start = weaken_1_end - (ns.getWeakenTime(server) + time_passed);
	// 	ns.print("time_left_before_weaken_1_start: ", time_left_before_weaken_1_start);
	// 	if (weaken_1_PID === null && time_left_before_weaken_1_start <= LAUNCH_SPACER) {
	// 		if (time_left_before_weaken_1_start > 0) {
	// 			await ns.sleep(time_left_before_weaken_1_start);
	// 			skip_sleep = true;
	// 		}
	// 		weaken_1_PID = ns.exec(weaken_script, host_server, weaken_1_threads, server, id + "_1", port);
	// 	}

	// 	time_passed = Date.now() - start;
	// 	let time_left_before_grow_start = grow_end - (ns.getGrowTime(server) + time_passed);
	// 	ns.print("time_left_before_grow_start: ", time_left_before_grow_start);
	// 	if (grow_PID === null && time_left_before_grow_start <= LAUNCH_SPACER) {
	// 		if (time_left_before_grow_start > 0) {
	// 			await ns.sleep(time_left_before_grow_start);
	// 			skip_sleep = true;
	// 		}
	// 		grow_PID = ns.exec(grow_script, host_server, grow_threads, server, id, port);
	// 	}

	// 	time_passed = Date.now() - start;
	// 	let time_left_before_weaken_2_start = weaken_2_end - (ns.getWeakenTime(server) + time_passed);
	// 	ns.print("time_left_before_weaken_2_start: ", time_left_before_weaken_2_start);
	// 	if (weaken_2_PID === null && time_left_before_weaken_2_start <= LAUNCH_SPACER) {
	// 		if (time_left_before_weaken_2_start > 0) {
	// 			await ns.sleep(time_left_before_weaken_2_start);
	// 			skip_sleep = true;
	// 		}
	// 		weaken_2_PID = ns.exec(weaken_script, host_server, weaken_2_threads, server, id + "_2", port);
	// 	}

	// 	ns.print(" ")
	// }

	// the launch order will be W1, W2, G, H
	time_passed = Date.now() - start;
	await ns.sleep(weaken_1_start - time_passed);
	weaken_1_PID = ns.exec(weaken_script, host_server, weaken_1_threads, server, id + "_1", port);
	
	time_passed = Date.now() - start;
	await ns.sleep(weaken_2_start - time_passed);
	weaken_2_PID = ns.exec(weaken_script, host_server, weaken_2_threads, server, id + "_2", port);
	
	time_passed = Date.now() - start;
	await ns.sleep(grow_start - time_passed);
	grow_PID = ns.exec(grow_script, host_server, grow_threads, server, id, port);
	
	time_passed = Date.now() - start;
	await ns.sleep(hack_start - time_passed);
	hack_PID = ns.exec(hack_script, host_server, hack_threads, server, id, port);

	// wait until all children finish
	while (ns.isRunning(hack_PID) || ns.isRunning(weaken_1_PID) || ns.isRunning(grow_PID) || ns.isRunning(weaken_2_PID)) {
		await ns.sleep(JOB_SPACER);
	}
}