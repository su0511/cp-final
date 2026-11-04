#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v npm >/dev/null 2>&1; then
  echo "请先安装 Node.js，然后重新打开此文件。"
  read -r "?按回车退出"
  exit 1
fi
if [[ ! -d node_modules ]]; then
  npm ci || exit 1
fi
echo "正在启动网站，请保留这个终端窗口。关闭网站服务请按 Control+C。"
( sleep 3; open 'http://localhost:3000' ) &
npm run dev -- --hostname 127.0.0.1 --port 3000
read -r "?按回车关闭窗口"
