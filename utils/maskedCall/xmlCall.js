export function connectXML(from, to) {
  return `
<Response>
  <Connect>
    <Call timeout="56">
      <Number>${to}</Number>
    </Call>
  </Connect>
</Response>`;
}