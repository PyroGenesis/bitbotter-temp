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

	let gap = parseInt(ns.args[8]);
	let hack_end = parseFloat(ns.args[9]);
	let weaken_1_end = hack_end + (gap * 1000);
	let grow_end = weaken_1_end + (gap * 1000);
	let weaken_2_end = grow_end + (gap * 1000);

	ns.disableLog("sleep");

	let hack_script = "/scripts/hack_once.js";
	let grow_script = "/scripts/grow_once.js";
	let weaken_script = "/scripts/weaken_once.js";

	let hack_launched = false;
	let weaken_1_launched = false;
	let grow_launched = false;
	let weaken_2_launched = false;
	let skip_sleep = false;
	
	let time_passed = null;

	while (!hack_launched || !weaken_1_launched || !grow_launched || !weaken_2_launched) {
		if (!skip_sleep) {
			await ns.sleep(1 * 1000);
		} else {
			skip_sleep = false;
		}

		time_passed = Date.now() - start;
		let time_left_before_hack_start = hack_end - (ns.getHackTime(server) + time_passed);
		ns.print("time_left_before_hack_start: ", time_left_before_hack_start);
		if (!hack_launched && time_left_before_hack_start <= 1) {
			if (time_left_before_hack_start > 0) {
				await ns.sleep(time_left_before_hack_start);
				skip_sleep = true;
			}
			ns.exec(hack_script, host_server, hack_threads, server, id, port)
			hack_launched = true;
		}

		time_passed = Date.now() - start;
		let time_left_before_weaken_1_start = weaken_1_end - (ns.getWeakenTime(server) + time_passed);
		ns.print("time_left_before_weaken_1_start: ", time_left_before_weaken_1_start);
		if (!weaken_1_launched && time_left_before_weaken_1_start <= 1) {
			if (time_left_before_weaken_1_start > 0) {
				await ns.sleep(time_left_before_weaken_1_start);
				skip_sleep = true;
			}
			ns.exec(weaken_script, host_server, weaken_1_threads, server, id + "_1", port)
			weaken_1_launched = true;
		}

		time_passed = Date.now() - start;
		let time_left_before_grow_start = grow_end - (ns.getGrowTime(server) + time_passed);
		ns.print("time_left_before_grow_start: ", time_left_before_grow_start);
		if (!grow_launched && time_left_before_grow_start <= 1) {
			if (time_left_before_grow_start > 0) {
				await ns.sleep(time_left_before_grow_start);
				skip_sleep = true;
			}
			ns.exec(grow_script, host_server, grow_threads, server, id, port)
			grow_launched = true;
		}

		time_passed = Date.now() - start;
		let time_left_before_weaken_2_start = weaken_2_end - (ns.getWeakenTime(server) + time_passed);
		ns.print("time_left_before_weaken_2_start: ", time_left_before_weaken_2_start);
		if (!weaken_2_launched && time_left_before_weaken_2_start <= 1) {
			if (time_left_before_weaken_2_start > 0) {
				await ns.sleep(time_left_before_weaken_2_start);
				skip_sleep = true;
			}
			ns.exec(weaken_script, host_server, weaken_2_threads, server, id + "_2", port)
			weaken_2_launched = true;
		}

		ns.print(" ")

		// if (hack_launched && weaken_1_launched && weaken_2_launched && grow_launched) {
		// 	break;
		// }
	}
}