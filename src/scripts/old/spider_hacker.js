import { copyAndExec } from "/scripts/lib/utils.js";

let servers = new Set()

/** @param {NS} ns 
 *  @param {string} server
*/
async function recurse(ns, server) {
	ns.disableLog("scp");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getScriptRam");
	ns.disableLog("exec");
	ns.disableLog("scan");
	ns.clearLog();
	ns.print("Script start");

	servers.add(server);

	// run hacker
	await copyAndExec(ns, server, '/scripts/just_hack.js', 'n00dles');

	// populate neighbors for hacking
	let neighbors = ns.scan(server);
	for (let neighbor of neighbors) {
		if (servers.has(neighbor)) continue;

		await recurse(ns, neighbor);
	}

}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("scan");
	ns.disableLog("scp");
	ns.disableLog("exec");
	ns.disableLog("getServerMaxRam");
	ns.clearLog();
	ns.print("Script start");

	await recurse(ns, "home");
	servers.clear();
}