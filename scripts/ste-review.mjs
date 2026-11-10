#!/usr/bin/env node
/**
 * Offline ASD-STE100 Issue 9 review aid.
 * Not an official or complete ASD-STE100 compliance checker.
 * No ASD dictionary content is bundled.
 */
import { readFileSync } from "node:fs";
import { resolve, extname } from "node:path";
import { pathToFileURL } from "node:url";

const LIMIT = { procedure: 20, description: 25 };
const CONTRACTIONS = /\b(?:don't|doesn't|didn't|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|shouldn't|couldn't|it's|that's|there's|we're|they're|you're|i'm|i've|we've|they've|i'll|we'll|they'll)\b/iu;
const LATIN = /\b(?:e\.g\.|i\.e\.|etc\.)/iu;
const PASSIVE = /\b(?:is|are|was|were|be|been|being)\s+\p{L}+(?:ed|en)\b/iu;

export function cleanLine(input) {
  return input
    .replace(/\x60[^\x60]*\x60/gu, " ")
    .replace(/!?\[[^\]]*\]\([^)]*\)/gu, " ")
    .replace(/https?:\/\/\S+/gu, " ")
    .replace(/^\s{0,3}(?:#+\s+|>\s+|[-*+]\s+|\d+[.)]\s+)/u, "")
    .replace(/\|/gu, " ")
    .replace(/\*\*|__/gu, "")
    .trim();
}
export function countWords(sentence) {
  return (sentence.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? []).length;
}
function splitSentences(line) {
  return line.split(/(?<=[.!?])\s+(?=[\p{Lu}\d])/u).filter(Boolean);
}
export function review(text, {mode = "description", lexicon = null} = {}) {
  if (!Object.hasOwn(LIMIT, mode)) throw new Error("Mode must be procedure or description");
  const findings = [];
  let activeMode = mode;
  let fenced = false;
  let paragraphCount = 0;
  const known = lexicon ? new Set([
    ...(lexicon.approved ?? []), ...(lexicon.technicalTerms ?? [])
  ].flatMap(x => x.toLowerCase().split(/\s+/u))) : null;
  const lines = text.split(/\r?\n/u);
  lines.forEach((raw, i) => {
    const n = i + 1;
    if (/^\s*(?:\x60{3}|~{3})/u.test(raw)) { fenced = !fenced; return; }
    if (fenced) return;
    if (/<!--\s*ste:procedure\s*-->/iu.test(raw)) {activeMode="procedure";return;}
    if (/<!--\s*ste:description\s*-->/iu.test(raw)) {activeMode="description";return;}
    if (/^\s*<!--/u.test(raw)) return;
    if (/^\s*$/u.test(raw)) { paragraphCount = 0; return; }
    if (/^\s*\|[-:\s|]+\|\s*$/u.test(raw)) return;
    if (/^\s*#/u.test(raw)) { paragraphCount = 0; return; }
    const line = cleanLine(raw);
    if (!line) return;
    const sentences = splitSentences(line);
    for (const sentence of sentences) {
      const length = countWords(sentence);
      if (length > LIMIT[activeMode]) {
        findings.push({line:n,rule:activeMode==="procedure"?"5.1":"6.3",severity:"error",
          message:"Sentence contains "+length+" words. Limit: "+LIMIT[activeMode]+"."});
      }
    }
    if (line.includes(";")) findings.push({line:n,rule:"8.1",severity:"error",message:"Do not use a semicolon in prose."});
    if (CONTRACTIONS.test(line)) findings.push({line:n,rule:"4.2",severity:"error",message:"Do not use contractions."});
    if (LATIN.test(line)) findings.push({line:n,rule:"GR-6",severity:"warning",message:"Use clear words instead of Latin abbreviations."});
    if (PASSIVE.test(line)) findings.push({line:n,rule:"3.6",severity:"warning",message:"Review possible passive voice. This is a heuristic."});
    if (activeMode==="description" && !/^\s*(?:[-*+]|\d+[.)]|\|)/u.test(raw)) {
      paragraphCount += sentences.length;
      if (paragraphCount > 6) {
        findings.push({line:n,rule:"6.6",severity:"warning",message:"A paragraph may contain more than six sentences."});
        paragraphCount = -10000;
      }
    }
    if (known) {
      for (const word of line.match(/\p{L}+(?:[-']\p{L}+)*/gu) ?? []) {
        if (!known.has(word.toLowerCase())) {
          findings.push({line:n,rule:"1.1-1.3",severity:"warning",
            message:"Review approved meaning, part of speech, or technical term: "+word});
        }
      }
    }
  });
  return findings;
}
export function cli(args) {
  let mode="description", lexicon=null, json=false;
  const paths=[];
  for(let i=0;i<args.length;i++){
    const a=args[i];
    if(a==="--mode")mode=args[++i];
    else if(a==="--lexicon")lexicon=JSON.parse(readFileSync(resolve(args[++i]),"utf8"));
    else if(a==="--json")json=true;
    else if(a.startsWith("-"))throw new Error("Unknown option: "+a);
    else paths.push(a);
  }
  if(!paths.length)throw new Error("Usage: node scripts/ste-review.mjs [--mode description|procedure] [--lexicon local.json] [--json] FILE...");
  const result=[];
  for(const file of paths){
    if(![".md",".txt"].includes(extname(file)))throw new Error("Only Markdown and text input are supported.");
    for(const finding of review(readFileSync(resolve(file),"utf8"),{mode,lexicon}))result.push({file,...finding});
  }
  if(json)console.log(JSON.stringify({standard:"ASD-STE100 Issue 9",status:"partial automated review only",findings:result},null,2));
  else{
    for(const f of result)console.log(f.file+":"+f.line+": "+f.severity+" [Rule "+f.rule+"] "+f.message);
    console.log("Review result: "+result.filter(f=>f.severity==="error").length+" errors, "+result.filter(f=>f.severity==="warning").length+" warnings. Manual review is still necessary.");
  }
  if(result.some(x=>x.severity==="error"))process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{cli(process.argv.slice(2));}catch(error){console.error(error.message);process.exitCode=2;}
}
