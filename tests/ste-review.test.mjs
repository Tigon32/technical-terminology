import test from "node:test";
import assert from "node:assert/strict";
import {review,countWords,cleanLine} from "../scripts/ste-review.mjs";

const words = n => Array.from({length:n},()=> "word").join(" ") + ".";
test("Issue 9 rule 5.1: at most 20 words in a procedure",()=>{
  assert.equal(review(words(20),{mode:"procedure"}).filter(x=>x.rule==="5.1").length,0);
  assert.equal(review(words(21),{mode:"procedure"}).filter(x=>x.rule==="5.1").length,1);
});
test("Issue 9 rule 6.3: at most 25 words in a description",()=>{
  assert.equal(review(words(25),{mode:"description"}).filter(x=>x.rule==="6.3").length,0);
  assert.equal(review(words(26),{mode:"description"}).filter(x=>x.rule==="6.3").length,1);
});
test("rule 8.1: a semicolon in prose is an error",()=>{
  assert.ok(review("Open the file; read the data.").some(x=>x.rule==="8.1"));
});
test("rule 4.2: contractions in prose are errors",()=>{
  assert.ok(review("Don't delete the source file.").some(x=>x.rule==="4.2"));
  assert.equal(review("Do not delete the source file.").filter(x=>x.rule==="4.2").length,0);
});
test("rule 3.6: possible passive voice is a warning, not proof",()=>{
  assert.ok(review("The file was deleted.").some(x=>x.rule==="3.6" && x.severity==="warning"));
});
test("rule 6.6: paragraph length is flagged",()=>{
  const t="One. Two. Three. Four. Five. Six. Seven.";
  assert.ok(review(t).some(x=>x.rule==="6.6"));
});
test("procedure and description markers switch word limits",()=>{
  const t="<!-- ste:procedure -->\n"+words(21)+"\n<!-- ste:description -->\n"+words(21);
  const f=review(t);
  assert.equal(f.filter(x=>x.rule==="5.1").length,1);
  assert.equal(f.filter(x=>x.rule==="6.3").length,0);
});
test("fenced code and inline identifiers are not ordinary prose",()=>{
  const t="~~~js\nconst x = 'don't';\n~~~\nUse the \x60don't\x60 identifier.";
  assert.equal(review(t).filter(x=>x.rule==="4.2").length,0);
});
test("links and punctuation are removed before word count",()=>{
  assert.equal(countWords(cleanLine("Use [this link](https://example.org) now.")),2);
});
test("the optional local lexicon does not certify a word meaning or part of speech",()=>{
  const f=review("The special component operates.",{lexicon:{approved:["the","component"],technicalTerms:[]}});
  assert.ok(f.some(x=>x.rule==="1.1-1.3" && x.severity==="warning"));
});
