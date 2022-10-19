const exec_script = "/scripts/exec.js";
const hack_script = "/scripts/just_hack.js";
const grow_script = "/scripts/just_grow.js";
const weaken_script = "/scripts/just_weaken.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.exec(exec_script, "home", 1, "foodnstuff", grow_script, "all", "n00dles");
	ns.exec(exec_script, "home", 1, "nectar-net", weaken_script, "all", "n00dles");
	ns.exec(exec_script, "home", 1, "n00dles", hack_script, "all", "n00dles");
	ns.exec(exec_script, "home", 1, "sigma-cosmetics", hack_script, "all", "n00dles");
	ns.exec(exec_script, "home", 1, "joesguns", hack_script, "all", "n00dles");
}