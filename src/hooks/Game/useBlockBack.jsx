import React, { useEffect } from 'react'

export function useBlockBackButton() {
  useEffect(() => {
    // 처음에 한 번 쌓기
    window.history.pushState({ __block: true }, "", window.location.href);
    window.history.pushState({ __block: true }, "", window.location.href);
    const onPop = (e) => {
      // 2) 뒤로가기가 발생하면 즉시 앞으로 1칸 이동시켜 무효화
      //    (pushState로 되쌓는 방식보다 빠르고 안정적)
      if (e.state && e.state.__block) {
        alert("뒤로가기는 막혀있습니다. X버튼을 눌러 종료하세요.");
        window.history.go(1);
      } else {
        // 혹시 모를 외부 상태면 가드 재삽입
        window.history.pushState({ __block: true }, "", window.location.href);
      }
    };
    // 뒤로가기를 누르면 다시 현재 페이지를 쌓아서 이동을 막음
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("popstate", onPop); };
  }, []);
}