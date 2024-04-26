# SVG Text Translation

a simple utility for internationalizing text in SVG images

| Package | Version | Website |
| --- | --- | --- |
| `bun` | `1.1.5` | [documentation](https://bun.sh/) |

```bash
bun translate <svg-file> --locale <locale> [--output <output-file>]
```

## Example Usage

The following command will translate the text in `./assets/example.svg` to Spanish and save the result to `./assets/example-es.svg`.

```bash
bun translate ./assets/example.svg --locale es
```
