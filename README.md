# Promethium

<a href="https://deepscan.io/dashboard#view=project&tid=15317&pid=19858&bid=521822"><img src="https://deepscan.io/api/teams/15317/projects/19858/branches/521822/badge/grade.svg" alt="DeepScan grade"></a>
<img alt="Github license badge" src="https://img.shields.io/github/license/Amatsagu/Promethium" />
<img alt="Maintenance badge" src="https://img.shields.io/maintenance/yes/2022" />

> Zero dependency, tiny web framework with routing included.

## Why would you use it?
- 💪 Built on native, Deno's TCP server *(v. high performance)*.
    * ⮤ Up to 9x times faster than Oak framework!
- 🗺️ Supports both static & dynamic routing *(string or regex)*.
- ♻️ Uses default [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) & [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) structs which are part of fetch API *(no extra abstraction)*.
- 📦 Comes with optional support for quick rendering of any static files, raw text, json & html documents. Those modules won't be loaded by default - you have to import `helpers.ts` file in order to access them.

### Quick performance check
<details>
  <summary>Click to see quick benchmark results!</summary>
  
  | Native Web Server                                                                       | Promethium Web Framework                                                                    |
|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| https://raw.githubusercontent.com/Amatsagu/Promethium/master/.github/native_benchmark.png | https://raw.githubusercontent.com/Amatsagu/Promethium/master/.github/Promethium_benchmark.png |
| Avg. 40.97K req/sec                                                                     | Avg. 40.56K req/sec                                                                       |

The code comes from https://github.com/denoland/deno_std/blob/main/http/bench.ts. Promethium version had the same code attached to "/" route.
</details>
<br />

## Example usage
<img alt="Example app usage" src="https://raw.githubusercontent.com/Amatsagu/Promethium/master/.github/example.png" />

## Contributing
1. Fork it!
2. Modify project to your like.
3. Test it! `deno test --allow-net --allow-read --unstable`
4. Create your feature branch: `git checkout -b my-new-feature`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request :D
