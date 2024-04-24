declare module "*.svg" {
  const content: string;
  export default content;
}

declare type SVGText = {
  tspan: string | number | (string | number)[]
}

declare type SVGPhrase = {
  tspan: string[]
}

declare type SVGNode = {
  rect?: string | string[]
  path?: string | string[]
  line?: string | string[]
  text?: SVGText
  g?: SVGNode[] | SVGNode
}

declare type SVGTree = {
  svg: SVGNode
}