import logo from './assets/example.svg'

const file = Bun.file(logo);

const text = await file.text();

console.log(text);