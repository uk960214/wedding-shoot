import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_PREFIX = 'wedding-shoot-0615-'

const timeline = [
  {
    id: 'home-prep',
    time: '09:30~10:30',
    start: '09:30',
    end: '10:30',
    title: '기상 · 컨디션 정리 · 최종 짐 확인',
    tag: '집',
    priority: 'medium',
    guide: '촬영이 길어질 수 있으니 물과 간단한 간식을 챙기기.',
    checks: [
      '가벼운 식사하기: 과식, 짠 음식 피하기',
      '렌즈/인공눈물/휴대폰/보조배터리 챙기기',
      '촬영 레퍼런스, 헤어변형 순서 캡처 바로 열리게 준비',
      '캐주얼 의상·신발·리본·강아지 용품 최종 확인',
    ],
  },
  {
    id: 'to-makeup',
    time: '10:30~11:20',
    start: '10:30',
    end: '11:20',
    title: '애브뉴준오로 이동',
    tag: '이동',
    priority: 'high',
    guide: '늦으면 뒤 일정이 모두 밀리므로 보수적으로 움직이기.',
    checks: [
      '애브뉴준오 주소 확인: 서울 강남구 청담동 63-14',
      '11:30 시작 기준 10분 전 도착 목표',
      '드레스 이모님/짐 동선 확인',
      '차량 호출 또는 예약 상태 확인',
    ],
  },
  {
    id: 'makeup-hair',
    time: '11:30~14:30',
    start: '11:30',
    end: '14:30',
    title: '애브뉴준오 메이크업 · 헤어',
    tag: '메이크업',
    priority: 'high',
    guide: '결과물만큼 14:30 아웃 시간 관리가 중요. 짐을 미리 모아두기.',
    checks: [
      '메이크업/헤어 레퍼런스 보여주기',
      '신랑 헤어·메이크업 최종 체크',
      '촬영 전 수정용 립/인공눈물 등 챙겼는지 확인',
      '14:30 아웃 시간 계속 체크',
    ],
  },
  {
    id: 'to-studio',
    time: '14:20~15:20',
    start: '14:20',
    end: '15:20',
    title: '무이스튜디오 유엔점으로 이동',
    tag: '이동',
    priority: 'critical',
    guide: '일반 택시는 이모님 캐리어가 트렁크에 안 들어갈 수 있어 벤 이동이 안전.',
    checks: [
      '벤/카카오벤 예약 또는 호출 확인',
      '이모님 캐리어가 실릴 수 있는지 확인',
      '무이스튜디오 주소 확인: 서울 용산구 한남동 11-335',
      '강아지 담당자에게 17:00~17:30 도착 재공유',
      '플라워/로맨틱조이 세팅 상황 확인',
    ],
  },
  {
    id: 'studio-briefing',
    time: '15:20~15:30',
    start: '15:20',
    end: '15:30',
    title: '스튜디오 도착 · 작가님/팀과 최종 브리핑',
    tag: '브리핑',
    priority: 'critical',
    guide: '원하는 컷, 우선순위, 강아지 합류 타이밍을 명확히 말하기.',
    checks: [
      '이민재 수석실장님 지정 확인',
      '촬영 순서 전달: 풍성 → 핑크 컬러 → 캐주얼 → 레이스 슬림',
      '꽃 관련 촬영을 먼저 하고 싶다고 전달',
      '강아지는 유색 막바지~캐주얼 사이에 합류 예정이라고 전달',
      '헤어변형은 현장 상황 보고 조율 가능하다고 공유',
    ],
  },
  {
    id: 'dress-full',
    time: '15:30~17:30',
    start: '15:30',
    end: '17:30',
    title: '1착: 풍성드레스',
    tag: '촬영',
    priority: 'high',
    guide: '풍성드레스는 2시간~2시간반 정도 예상. 첫 착에서 체력을 너무 쓰지 않기.',
    checks: [
      '초반 웨이브 헤어로 촬영',
      '중간부터 반묶음 전환',
      '꽃/클래식한 컷 우선 촬영 여부 확인',
      '드레스·부케·소품이 잘 보이는 컷 요청',
      '17시 전후 강아지 담당자에게 위치 공유',
    ],
  },
  {
    id: 'dog-arrival',
    time: '17:00~17:30',
    start: '17:00',
    end: '17:30',
    title: '강아지 도착 · 적응 시간',
    tag: '강아지',
    priority: 'critical',
    guide: '유색드레스 막바지와 캐주얼 촬영을 자연스럽게 연결하려면 17:00~17:30 도착이 적당.',
    checks: [
      '강아지 도착 확인',
      '물/간식/배변패드/물티슈 준비',
      '스튜디오 공간에 적응할 시간 주기',
      '작가님에게 강아지 컨디션 공유',
      '리드줄, 이동가방, 보호자 대기 위치 확인',
    ],
  },
  {
    id: 'dress-pink',
    time: '17:30~18:30',
    start: '17:30',
    end: '18:30',
    title: '2착: 핑크 컬러드레스',
    tag: '촬영',
    priority: 'high',
    guide: '반묶음이 반복되면 상체 컷이 비슷해 보일 수 있으므로 현장에서 헤어 변화 폭 확인.',
    checks: [
      '반묶음 그대로 시작',
      '라푼젤헤어/옆으로 땋은 머리 전환 타이밍 확인',
      '꽃 관련 컷 먼저 촬영',
      '강아지와 함께 찍을 컷 가능 여부 현장 판단',
      '유색드레스와 캐주얼 전환 동선 확인',
    ],
  },
  {
    id: 'casual',
    time: '18:30~19:30',
    start: '18:30',
    end: '19:30',
    title: '3착: 캐주얼',
    tag: '촬영',
    priority: 'high',
    guide: '강아지 컷은 변수 많으니 꼭 남기고 싶은 3~5컷을 먼저 확보.',
    checks: [
      '반묶음 + 리본 포인트 적용',
      '강아지와 함께 찍는 컷 우선 확보',
      '캐주얼 의상·신발·소품 빠짐 없는지 확인',
      '강아지 컨디션이 떨어지기 전에 핵심 컷 먼저 촬영',
      '보호자에게 강아지 휴식/물 챙기기 요청',
    ],
  },
  {
    id: 'dress-slim',
    time: '19:30~21:00',
    start: '19:30',
    end: '21:00',
    title: '4착: 레이스 슬림',
    tag: '촬영',
    priority: 'medium',
    guide: '마지막 착은 체력이 떨어지는 시간. 표정과 자세 체크를 서로 해주기.',
    checks: [
      '로우포니 → 로우번 전환',
      '야간/마지막 분위기 컷 요청',
      '피곤해도 자세·턱선·손 디테일 체크',
      '최종으로 못 찍은 컷 있는지 작가님께 확인',
      '짐 회수 위치 확인',
    ],
  },
  {
    id: 'wrap',
    time: '21:00~22:30',
    start: '21:00',
    end: '22:30',
    title: '촬영 종료 · 정산 · 귀가',
    tag: '마무리',
    priority: 'medium',
    guide: '마지막에는 정신이 없으니 소품과 강아지 용품 회수 체크가 중요.',
    checks: [
      '개인 짐, 소품, 강아지 용품 회수',
      '현장 추가비/잔금/이체 내역 확인',
      '작가님·이모님·헤어변형 선생님께 감사 인사',
      '귀가 차량 호출',
      '집 도착 후 촬영복/소품 분리 보관',
    ],
  },
]

const preDay = [
  '벤/카카오벤 예약 확인: 메이크업샵 → 무이스튜디오 이동용',
  '애브뉴준오·무이스튜디오 주소 지도 저장',
  '촬영 레퍼런스와 헤어변형 순서 캡처 앨범 만들기',
  '플라워/로맨틱조이 관련 요청사항 정리: 꽃 관련 촬영 먼저',
  '강아지 담당자에게 17:00~17:30 도착 시간 공유',
  '강아지 용품 준비: 리드줄, 이동가방, 배변패드, 물, 간식, 물티슈',
  '캐주얼 의상, 신발, 리본 포인트, 소품 한 가방에 묶기',
  '신랑: 면도기, 양말, 구두, 속옷, 손톱 정리',
  '신부: 렌즈, 인공눈물, 립, 네일 상태 확인',
  '휴대폰·보조배터리·충전기 완충',
  '잔금/추가비 이체 계좌 또는 현금 확인',
  '야식, 술, 짠 음식 피하고 일찍 자기',
]

const packingGroups = [
  { title: '필수', items: ['휴대폰', '지갑/카드', '보조배터리', '충전기', '렌즈', '인공눈물', '물', '간단한 간식'] },
  { title: '촬영', items: ['캐주얼 의상', '캐주얼 신발', '리본 포인트', '촬영 소품', '헤어변형 레퍼런스', '촬영 컷 레퍼런스'] },
  { title: '강아지', items: ['리드줄', '이동가방', '배변패드', '물그릇', '간식', '물티슈', '휴지', '배변봉투'] },
  { title: '신랑', items: ['면도기', '검정 양말', '살색/흰 양말', '구두', '속옷', '손톱 정리 도구'] },
  { title: '정산', items: ['계좌이체 앱 확인', '잔금 목록 캡처', '현장 추가비 예비금', '입금내역 확인'] },
]

const locations = [
  {
    name: '애브뉴준오 청담',
    time: '11:30 시작 / 14:30 아웃',
    address: '서울 강남구 청담동 63-14 준오헤어 사옥',
    note: '촬영 메이크업: m 채원부원장님 / h 서희실장님',
    query: '애브뉴준오 청담',
  },
  {
    name: '무이스튜디오 유엔점',
    time: '15:30 촬영 시작',
    address: '서울 용산구 한남동 11-335',
    note: '작가: 이민재 수석실장님 지정',
    query: '무이스튜디오 유엔점',
  },
]

const keyMemos = [
  '최종 촬영 순서: 풍성드레스 → 핑크 컬러드레스 → 캐주얼 → 레이스 슬림',
  '헤어 가이드: 웨이브→반묶음 / 반묶음→라푼젤 / 반묶음+리본 / 로우포니→로우번',
  '강아지: 17:00~17:30 도착, 적응 시간 확보, 유색 막바지~캐주얼 컷 우선',
  '이동: 이모님 캐리어 때문에 일반 택시보다 벤 권장',
  '현장 조율: 반묶음 반복으로 상체 컷이 비슷할 수 있으니 헤어 변화 폭 확인',
]

const tabs = [
  { id: 'timeline', label: '당일 타임라인' },
  { id: 'preday', label: '전날 체크' },
  { id: 'packing', label: '짐 체크' },
  { id: 'memo', label: '주소·핵심 메모' },
]

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function formatClock(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function getActiveBlock(timeValue) {
  const minutes = toMinutes(timeValue)
  const matches = timeline.filter((item) => minutes >= toMinutes(item.start) && minutes < toMinutes(item.end))

  if (matches.length) {
    return matches.sort((a, b) => {
      const durationA = toMinutes(a.end) - toMinutes(a.start)
      const durationB = toMinutes(b.end) - toMinutes(b.start)
      if (a.priority === 'critical' && b.priority !== 'critical') return -1
      if (b.priority === 'critical' && a.priority !== 'critical') return 1
      return durationA - durationB
    })[0]
  }

  return timeline.find((item) => minutes < toMinutes(item.start)) ?? timeline[timeline.length - 1]
}

function flattenChecklistIds() {
  const ids = []
  timeline.forEach((block) => block.checks.forEach((_, index) => ids.push(`timeline-${block.id}-${index}`)))
  preDay.forEach((_, index) => ids.push(`pre-${index}`))
  packingGroups.forEach((group) => group.items.forEach((_, index) => ids.push(`pack-${group.title}-${index}`)))
  keyMemos.forEach((_, index) => ids.push(`memo-${index}`))
  return ids
}

function App() {
  const [tab, setTab] = useState('timeline')
  const [checked, setChecked] = useState(() => {
    const saved = {}
    flattenChecklistIds().forEach((id) => {
      saved[id] = localStorage.getItem(`${STORAGE_PREFIX}${id}`) === 'true'
    })
    return saved
  })
  const [now, setNow] = useState(new Date())
  const [manualTime, setManualTime] = useState('')
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const cardRefs = useRef({})

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isManualTimeValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(manualTime)
  const effectiveTime = isManualTimeValid ? manualTime : `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const activeBlock = useMemo(() => getActiveBlock(effectiveTime), [effectiveTime])
  const allIds = useMemo(() => flattenChecklistIds(), [])
  const doneCount = allIds.filter((id) => checked[id]).length
  const progress = Math.round((doneCount / allIds.length) * 100)

  function toggleCheck(id) {
    setChecked((current) => {
      const nextValue = !current[id]
      localStorage.setItem(`${STORAGE_PREFIX}${id}`, String(nextValue))
      return { ...current, [id]: nextValue }
    })
  }

  function resetChecks() {
    if (!window.confirm('모든 체크 상태를 초기화할까요?')) return
    allIds.forEach((id) => localStorage.removeItem(`${STORAGE_PREFIX}${id}`))
    setChecked({})
  }

  function scrollToActive() {
    setTab('timeline')
    window.setTimeout(() => {
      cardRefs.current[activeBlock.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  return (
    <div className="app-shell">
      <header className={`hero ${isScrolled ? 'compact' : ''}`}>
        <div className="hero-top">
          <div>
            <p className="eyebrow">Wedding Shoot Day</p>
            <h1>6월 15일 웨딩 촬영 당일 가이드</h1>
            <p className="subtitle">해민 ❤️ 요욱</p>
          </div>
          <div className="clock" aria-label="현재 시간">
            {formatClock(now)}
          </div>
        </div>

        <div className="pill-row" aria-label="핵심 일정">
          <span>2026.06.15 월</span>
          <span>11:30 애브뉴준오</span>
          <span>15:30 무이 유엔점</span>
          <span>17:00~17:30 강아지</span>
        </div>

        <section className="now-card" aria-label="현재 또는 다음 일정">
          <div className="now-label">{isManualTimeValid ? `${manualTime} 기준` : '현재 시간 기준'}</div>
          <h2>{activeBlock.title}</h2>
          <p>{activeBlock.time} · {activeBlock.tag}</p>
          <ul>
            {activeBlock.checks.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="progress-area" aria-label="전체 체크 진행률">
          <div className="progress-copy">
            <span>전체 체크</span>
            <strong>{doneCount}/{allIds.length} · {progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="actions no-print">
          <button type="button" onClick={scrollToActive}>현재 카드로 이동</button>
          <button type="button" onClick={() => setShowTimePicker((value) => !value)}>시간 직접 선택</button>
          <button type="button" onClick={() => window.print()}>인쇄/PDF</button>
          <button type="button" className="danger" onClick={resetChecks}>체크 초기화</button>
        </div>

        {showTimePicker && (
          <div className="time-picker no-print">
            <label htmlFor="manual-time">확인할 시간</label>
            <input
              id="manual-time"
              type="text"
              inputMode="numeric"
              pattern="[0-2][0-9]:[0-5][0-9]"
              placeholder="17:10"
              value={manualTime}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d:]/g, '').slice(0, 5)
                setManualTime(value)
              }}
            />
            <button type="button" onClick={() => setManualTime('')}>실시간으로 보기</button>
          </div>
        )}
      </header>

      <nav className="tabs no-print" aria-label="가이드 섹션">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>
        <section className={`tab-panel ${tab === 'timeline' ? '' : 'hidden'}`} aria-labelledby="timeline-title">
          <h2 id="timeline-title">당일 타임라인</h2>
          <div className="timeline-list">
            {timeline.map((block) => (
              <TimelineCard
                key={block.id}
                block={block}
                activeId={activeBlock.id}
                effectiveTime={effectiveTime}
                checked={checked}
                onToggle={toggleCheck}
                refCallback={(node) => { cardRefs.current[block.id] = node }}
              />
            ))}
          </div>
        </section>

        <section className={`tab-panel ${tab === 'preday' ? '' : 'hidden'}`} aria-labelledby="pre-title">
          <h2 id="pre-title">전날 체크</h2>
          <Checklist items={preDay} idFactory={(index) => `pre-${index}`} checked={checked} onToggle={toggleCheck} />
        </section>

        <section className={`tab-panel ${tab === 'packing' ? '' : 'hidden'}`} aria-labelledby="packing-title">
          <h2 id="packing-title">짐 체크</h2>
          <div className="group-grid">
            {packingGroups.map((group) => (
              <article className="soft-card" key={group.title}>
                <h3>{group.title}</h3>
                <Checklist items={group.items} idFactory={(index) => `pack-${group.title}-${index}`} checked={checked} onToggle={toggleCheck} />
              </article>
            ))}
          </div>
        </section>

        <section className={`tab-panel ${tab === 'memo' ? '' : 'hidden'}`} aria-labelledby="memo-title">
          <h2 id="memo-title">주소·핵심 메모</h2>
          <div className="location-grid">
            {locations.map((location) => (
              <article className="location-card" key={location.name}>
                <div>
                  <p className="card-kicker">{location.time}</p>
                  <h3>{location.name}</h3>
                </div>
                <p>{location.address}</p>
                <p className="note">{location.note}</p>
                <a href={`https://map.kakao.com/link/search/${encodeURIComponent(location.query)}`} target="_blank" rel="noreferrer">
                  카카오맵에서 보기
                </a>
              </article>
            ))}
          </div>
          <article className="soft-card">
            <h3>핵심 메모</h3>
            <Checklist items={keyMemos} idFactory={(index) => `memo-${index}`} checked={checked} onToggle={toggleCheck} />
          </article>
        </section>
      </main>
    </div>
  )
}

function TimelineCard({ block, activeId, effectiveTime, checked, onToggle, refCallback }) {
  const currentMinutes = toMinutes(effectiveTime)
  const state = block.id === activeId
    ? 'current'
    : currentMinutes >= toMinutes(block.end)
      ? 'past'
      : 'upcoming'

  return (
    <article className={`timeline-card ${state} priority-${block.priority}`} ref={refCallback}>
      <div className="card-heading">
        <div>
          <p className="time-range">{block.time}</p>
          <h3>{block.title}</h3>
        </div>
        <span className="tag">{block.tag}</span>
      </div>
      <p className="guide">{block.guide}</p>
      <Checklist
        items={block.checks}
        idFactory={(index) => `timeline-${block.id}-${index}`}
        checked={checked}
        onToggle={onToggle}
      />
    </article>
  )
}

function Checklist({ items, idFactory, checked, onToggle }) {
  return (
    <div className="checklist">
      {items.map((item, index) => {
        const id = idFactory(index)
        return (
          <label className={`check-row ${checked[id] ? 'done' : ''}`} key={id}>
            <input type="checkbox" checked={Boolean(checked[id])} onChange={() => onToggle(id)} />
            <span>{item}</span>
          </label>
        )
      })}
    </div>
  )
}

export default App
