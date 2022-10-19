const exec_script = "/scripts/exec.js";
const hack_script = "/scripts/just_hack.js";
const grow_script = "/scripts/just_grow.js";
const weaken_script = "/scripts/just_weaken.js";

/** @param {import("../../").NS} ns */
export async function main(ns) {
	ns.exec(exec_script, "home", 1, "foodnstuff", "all", grow_script, "n00dles");
	ns.exec(exec_script, "home", 1, "nectar-net", "all", weaken_script, "n00dles");
	ns.exec(exec_script, "home", 1, "n00dles", "all", hack_script, "n00dles");
	ns.exec(exec_script, "home", 1, "sigma-cosmetics", "all", hack_script, "n00dles");
	ns.exec(exec_script, "home", 1, "joesguns", "all", hack_script, "n00dles");
}