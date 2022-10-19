import { NS } from "@ns";

const exec_script = "/scripts/exec.js";
// const hack_script = "/scripts/just_hack.js";
// const grow_script = "/scripts/just_grow.js";
const weaken_script = "/scripts/just_weaken.js";

/** @param {NS} ns */
export async function main(ns: NS) {	
	for (let i=1; i<=25; i++) {
		if (!ns.serverExists(`homeserv-${i}`)) break;
		ns.exec(exec_script, "home", 1, `homeserv-${i}`, "all", weaken_script, "foodnstuff");
	}
}