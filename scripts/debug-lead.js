const text = `石器による区分<div class="lead">旧石器時代から<span onclick="chg(this)" class="all">新石器時代</span>（約１万2000年前～）</div>`;

// processLeadDivの処理をシミュレート
if (text.includes('<div class="lead">')) {
  const leadStart = text.indexOf('<div class="lead">');
  const leadContentStart = leadStart + '<div class="lead">'.length;
  const leadEnd = text.indexOf('</div>', leadContentStart);
  
  const beforeHTML = text.substring(0, leadStart);
  const leadHTML = text.substring(leadContentStart, leadEnd);
  const afterHTML = text.substring(leadEnd + '</div>'.length);
  
  console.log('=== HTML分割 ===');
  console.log('before:', beforeHTML);
  console.log('lead:', leadHTML);
  console.log('after:', afterHTML);
  
  // cleanInlineのシミュレート
  function cleanInline(t) {
    if (!t) return '';
    let result = t;
    result = result.replace(/\t/g, '').replace(/\n/g, '').replace(/\s+/g, ' ');
    result = result.replace(/<span onclick="chg\(this\)" class="all"><ruby>(.+?)<rt>(.+?)<\/rt><\/ruby><\/span>/g, '[[$1|$2]]');
    result = result.replace(/<span onclick="chg\(this\)" class="all">(.+?)<\/span>/g, '[[$1]]');
    result = result.replace(/<ruby>(.+?)<rt>(.+?)<\/rt><\/ruby>/g, '{{$1|$2}}');
    result = result.replace(/<span class="marker">(.+?)<\/span>/g, '==$1==');
    result = result.replace(/<font color="#FF0000">(.+?)<\/font>/g, '**$1**');
    result = result.replace(/<[^>]+>/g, '');
    return result.trim();
  }
  
  const beforeClean = cleanInline(beforeHTML).trim();
  const leadClean = cleanInline(leadHTML).trim();
  const afterClean = cleanInline(afterHTML).trim();
  
  console.log('\n=== clean後 ===');
  console.log('before:', beforeClean);
  console.log('lead:', leadClean);
  console.log('after:', afterClean);
  
  let parts = [];
  if (beforeClean) parts.push(beforeClean);
  if (leadClean) {
    parts.push(':::lead');
    parts.push(leadClean);
    parts.push(':::');
  }
  if (afterClean) parts.push(afterClean);
  
  console.log('\n=== 最終出力 ===');
  console.log(parts.join('\n'));
}
