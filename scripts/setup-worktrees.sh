#!/usr/bin/env bash

# ==============================================================================
# [Git Worktree 관리 스크립트]
# 각 에이전트가 다른 에이전트의 작업에 방해받지 않고
# 자신만의 브랜치/작업 폴더에서 안전하게 코딩할 수 있도록 워크트리를 세팅합니다.
# ==============================================================================

set -e

WORKTREE_DIR=".worktrees"

echo "🌳 [한글 배움터] Git 워크트리 환경 점검 및 셋팅을 시작합니다..."

# .worktrees 폴더 생성
mkdir -p "$WORKTREE_DIR"

# 기능별 브랜치 및 워크트리 정의
declare -A BRANCHES=(
  ["ui-design"]="feat/ui-design"
  ["audio-interactive"]="feat/audio-interactive"
  ["hangeul-quiz"]="feat/hangeul-quiz"
)

for NAME in "${!BRANCHES[@]}"; do
  BRANCH="${BRANCHES[$NAME]}"
  TARGET_PATH="$WORKTREE_DIR/$NAME"

  if [ -d "$TARGET_PATH" ]; then
    echo "  ✅ [$NAME] 워크트리가 이미 존재합니다: $TARGET_PATH ($BRANCH)"
  else
    # 브랜치가 없으면 새로 생성
    if ! git show-ref --quiet --heads "$BRANCH"; then
      echo "  🌱 브랜치 '$BRANCH'를 생성합니다."
      git branch "$BRANCH" main
    fi

    echo "  🚀 워크트리를 연결합니다: $TARGET_PATH -> $BRANCH"
    git worktree add "$TARGET_PATH" "$BRANCH"
  fi
done

echo ""
echo "✨ 현재 설정된 모든 워크트리 목록:"
git worktree list
echo "🎉 워크트리 셋팅이 완료되었습니다!"
