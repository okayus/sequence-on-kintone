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
    const participants = record[participantTable].value.map((participant) => participant.value['対象者'].value);
    // mermaid記法に変換
    let mermaidText = 'sequenceDiagram\n';
    participants.forEach((participant) => {
      mermaidText += `participant ${participant}\n`;
    });
    // メッセージの追加
    const messages = record[messageTable].value.map((message) => {
      const from = message.value['誰が'].value;
      const to = message.value['誰に'].value;
      const text = message.value['何をする'].value;
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