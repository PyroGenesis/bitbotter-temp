/** @param {NS} ns */
export async function main(ns) {
	
	ns.print("Max money: ", ns.getServerMaxMoney("n00dles"))
	ns.print("Current money: ", ns.getServerMoneyAvailable("n00dles"))
	ns.print("Server hack: ", ns.getServerSecurityLevel("n00dles"))
	ns.print("Current hack: ", ns.getHackingLevel())
}