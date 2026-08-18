import { md } from '../lib/text'
export const Md = ({ text }: { text: string }) => (
  <>{md(text).map((p, i) => (typeof p === 'string' ? p : <i key={i}>{p.i}</i>))}</>
)
