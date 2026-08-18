import { md } from '../lib/text'
export const Md = ({ text }: { text: string }) => (
  <>{md(text).map((p, i) => (typeof p === 'string' ? p : <i key={i} className="mantra text-[1em] leading-normal">{p.i}</i>))}</>
)
