(function (PLUGIN_ID) {
  'use strict';

  // Mermaid.jsの初期化
  window.mermaid.initialize({ startOnLoad: false });

  kintone.events.on('app.record.detail.show', async (event) => {
    const sequenceDiagram = generateSequenceMermaid(event);
    const content = document.querySelector('#user-js-sequence-diagram');
    const diagram = document.createElement('div');
    diagram.id = 'diagram';
    diagram.className = 'mermaid';
    const { svg } = await mermaid.render('diagram', sequenceDiagram);
    diagram.innerHTML = svg;
    content.appendChild(diagram);
  });
  const participantTable = "対象者リスト";
  const messageTable = "手順";

  function generateSequenceMermaid(event) {
    const record = event.record;
    const participants = record[participantTable].value.map((participant) => {
      const result = {type: '', name: ''};
      result.type = participant.value['アイコンタイプ'].value;
      result.name = participant.value['対象者'].value;
      return result;
    });
    // mermaid記法に変換
    let mermaidText = 'sequenceDiagram\n';
    participants.forEach((participant) => {
      mermaidText += `${participant.type} ${participant.name}\n`;
    });
    // メッセージの追加
    const messages = record[messageTable].value.map((message) => {
      const from = message.value['誰が'].value;
      const to = message.value['誰に'].value;
      // 改行をbrに変換してtextに格納
      // const text = message.value['何をする'].value;
      const text = message.value['何をする'].value.replace(/\n/g, '<br>');
      // toがない場合はNoteとして表示
      if (to === '') {
        return `Note over ${from}: ${text}`;
      }
      return `${from}->>${to}: ${text}`;
    });
    mermaidText += messages.join('\n');
    return mermaidText;
  }
})(kintone.$PLUGIN_ID);