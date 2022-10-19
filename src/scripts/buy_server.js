/** 
 * @param {NS} ns 
*/
function printArgs(ns) {
	ns.tprint("Arguments needed for buy_server.js");
	ns.tprint("power     The RAM of the server to buy equal to 2^power (1-20)");
	ns.tprint("suffix    The suffix of the server to buy in the format homeserv-suffix (1-25 or 'all')");
}

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length === 1 && ns.args[0] === 'help') {
		printArgs(ns);
		return;
	}

	if (ns.args[1] === 'all') {
		for (let i=1; i<=25; i++) {
			if (ns.serverExists(`homeserv-${i}`)) continue;
			ns.purchaseServer(`homeserv-${i}`, Math.pow(2, parseInt(ns.args[0])));
		}
	} else {
		ns.purchaseServer(`homeserv-${ns.args[1]}`, Math.pow(2, parseInt(ns.args[0])));
	}	
}