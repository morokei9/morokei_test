#!/bin/bash

# 메인 페이지 목록
MAIN_PAGES=(
  "virtues.html:Virtues and Dilemmas"
  "talkabouts.html:Talkabouts"
  "deeplearning.html:DeepLearning"
  "investments.html:Investments"
  "secrecy.html:Secrecy"
  "apps.html:Apps"
)

# 하위 페이지 목록
SUB_PAGES=(
  "dogma-nature.html:Nature"
  "dogma-doctrine.html:Doctrine"
  "talkabouts-shittalks.html:Shittalks"
  "talkabouts-dreamabouts.html:Dreamabouts"
  "talkabouts-heartwords.html:HeartWords"
  "talkabouts-scribbles.html:낙서"
  "deeplearning-chess.html:Chess"
  "deeplearning-chess-archive.html:Archive"
  "deeplearning-crypto.html:Crypto"
  "deeplearning-crypto-tradingbot.html:Trading Bot"
  "deeplearning-crypto-hash.html:Hash"
  "deeplearning-crypto-server.html:Server"
  "investments-private-equity.html:Private Equity"
  "investments-howdidhedothat.html:howdidhedothat"
  "investments-funzies.html:Funzies"
  "secrecy-exhibition.html:EXHIBITION"
  "secrecy-curse.html:curse"
  "secrecy-girl.html:G̸̱̰̙̜̯͍̊͑̓̂̋̑̂͛͝͠ỉ̶͉̊̅̓͒̽̽̀̕͘ŕ̶̛͎̰̪̌̓͂ ̸̎̍͒̌ḻ̸̢͕̣͓̋̓̊̈́̌͆͠"
  "secrecy-money.html:money"
  "apps-twitter.html:Twitter"
  "apps-shorts.html:Shorts"
  "apps-telegram.html:Telegram"
)

# 템플릿 파일 경로
TEMPLATE="page-template.html"

# 메인 페이지 생성
for page in "${MAIN_PAGES[@]}"; do
  # 파일명과 제목을 분리
  FILENAME=$(echo $page | cut -d: -f1)
  TITLE=$(echo $page | cut -d: -f2)
  
  # 파일이 존재하지 않으면 생성
  if [ ! -f "$FILENAME" ]; then
    # 템플릿 복사 및 제목 변경
    cat "$TEMPLATE" | sed "s/PAGE_TITLE/$TITLE/g" | sed "s/class=\"active\">/class=\"active\">/g" | sed "s/href=\"$FILENAME\"/href=\"$FILENAME\" class=\"active\"/g" > "$FILENAME"
    echo "Created $FILENAME"
  else
    echo "Skipping $FILENAME (already exists)"
  fi
done

# 하위 페이지 생성
for page in "${SUB_PAGES[@]}"; do
  # 파일명과 제목을 분리
  FILENAME=$(echo $page | cut -d: -f1)
  TITLE=$(echo $page | cut -d: -f2)
  
  # 상위 페이지 식별
  PARENT=$(echo $FILENAME | cut -d- -f1)".html"
  
  # 파일이 존재하지 않으면 생성
  if [ ! -f "$FILENAME" ]; then
    # 템플릿 복사 및 제목 변경
    cat "$TEMPLATE" | sed "s/PAGE_TITLE/$TITLE/g" | sed "s/class=\"active\">/class=\"active\">/g" | sed "s/href=\"$PARENT\"/href=\"$PARENT\" class=\"active\"/g" | sed "s/href=\"$FILENAME\"/href=\"$FILENAME\" class=\"active\"/g" > "$FILENAME"
    echo "Created $FILENAME"
  else
    echo "Skipping $FILENAME (already exists)"
  fi
done

echo "All pages created successfully!"