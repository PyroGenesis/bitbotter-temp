/** @param {NS} ns 
 *  @param {string} server
 *  @param {string} script
*/
export async function copyAndExec(ns, server, script, threads, ...args) {
	if (server === "home" || !ns.hasRootAccess(server)) {
		ns.print(`Don't have root on ${server}`);
		return;
	}

	if (!await ns.scp(script, server, "home")) {
		ns.print(`Failed to copy ${script} to ${server}`);
		return;
	}

	// threads
	if (threads == "all") {
		threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script, server));
	}

	// run the script
	ns.exec(script, server, threads, ...args);
	ns.tprint(`Ran ${threads} threads on ${server}`);
}

/** 
 * @param {NS} ns
*/
export function getServerList(ns) {
	let servers = new Set();
	let server_list = [];

	/** @param {NS} ns 
	 *  @param {string} server
	*/
	function recurse(ns, server) {
		servers.add(server);

		// get all details
		if (server !== "home" && ns.hasRootAccess(server)) {
			server_list.push({
				name: server,
				max_money: ns.getServerMaxMoney(server),
				max_ram: ns.getServerMaxRam(server),
				min_security: ns.getServerMinSecurityLevel(server)
			});
		}

		// populate neighbors for hacking
		let neighbors = ns.scan(server);
		for (let neighbor of neighbors) {
			if (servers.has(neighbor)) continue;

			recurse(ns, neighbor);
		}

	}

	recurse(ns, 'home');
	return server_list;
}