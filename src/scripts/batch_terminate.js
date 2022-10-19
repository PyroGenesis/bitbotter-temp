/** @param {NS} ns */
export async function main(ns) {
	let host_server = ns.getServer().hostname;
	
	// kills all dispatch and hack scripts because timings will no longer be consistent
	ns.scriptKill("/scripts/batcher.js", host_server);
	ns.scriptKill("/scripts/dispatcher.js", host_server);
	ns.scriptKill("/scripts/hack_once.js", host_server);
}