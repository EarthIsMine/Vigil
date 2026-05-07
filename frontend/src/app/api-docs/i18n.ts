export type Lang = 'en' | 'ko';

export const STRINGS = {
  en: {
    header: {
      getHelp: 'Get Help',
      mainSite: 'Main Site',
      searchPlaceholder: 'Search...',
      themeLight: 'Switch to light mode',
      themeDark: 'Switch to dark mode',
    },
    tabs: {
      documentation: 'Documentation',
      apiReference: 'API Reference',
      docPlaceholder: 'Documentation is coming soon. For now, please refer to the API Reference tab.',
    },
    sidebar: {
      groups: {
        'Getting Started': 'Getting Started',
        'Core API': 'Core API',
        'System': 'System',
      },
      items: {
        introduction: 'Introduction',
        authentication: 'Authentication',
        'send-transaction': 'Send Transaction',
        'mev-receipt': 'MEV Receipt',
        'protection-status': 'Protection Status',
        'rate-limits': 'Rate Limits',
        settings: 'Settings',
      },
      docGroups: {
        gettingStarted: 'Getting Started',
        detectorReadme: 'Sandwich Detector',
        detectorDesign: 'Detection Design',
        rpcReadme: 'Protection RPC',
      },
      gettingStartedPages: {
        overview: 'Overview',
        quickstart: 'Quickstart',
      },
      noResults: 'No matching topics',
    },
    rightToc: {
      title: 'On this page',
    },
    content: {
      breadcrumb: 'Overview',
      copyPage: 'Copy page',
      copied: 'Copied',
      baseUrl: 'Base URL',
      header: 'Header',
      parameters: 'Parameters',
      pathParameters: 'Path Parameters',
      responseFields: 'Response Fields',
      introduction: {
        h1: 'Vigil API Reference',
        subtitle: 'Overview of the Vigil APIs',
        intro:
          'The Vigil API provides programmatic access to MEV-protected transaction submission, real-time execution tracking, and rebate settlement on Solana. Build with confidence — every transaction is shielded.',
        executionTitle: 'Sub-400ms Execution',
        executionDesc:
          'Optimized routing through Jito bundles and multi-path submission ensures your transactions land in under 400ms.',
        rebateTitle: 'Rebate Settlement',
        rebateDesc:
          'Automated MEV rebates returned directly to your wallet. Track captured value via the receipt endpoint.',
      },
      authentication: {
        bodyStart: 'All API requests require a Bearer token in the',
        bodyEnd: 'header. Generate keys from the',
        dashboardLink: 'Vigil Dashboard',
        dot: '.',
        warning:
          'Keep your secret key secure. Do not expose it in client-side code or public repositories.',
      },
      sendTransaction: {
        body:
          'Submit a serialized transaction for MEV-protected execution. Returns a transaction hash and protection metadata.',
        param1Desc: 'Base64-encoded serialized transaction. Must be a valid Solana transaction.',
        param2DescStart: 'Level of MEV protection.',
        param3DescStart: 'Skip preflight simulation before submitting. Default:',
        codeLabelTs: 'TypeScript',
        codeLabel200: '200 OK — Response',
      },
      receipt: {
        body:
          'Retrieve the MEV protection receipt for a submitted transaction. Includes captured MEV value, rebate amount, and settlement status.',
        hashDesc: 'The transaction signature returned from the send endpoint.',
        mevDesc: 'Total MEV value captured (in SOL).',
        rebateDesc: 'Rebate returned to user wallet (in SOL).',
        statusDescStart: 'Current state:',
        codeLabel: 'MEV Receipt — Response',
      },
      protectionStatus: {
        body:
          'Check the real-time status of MEV protection services, including current latency and active protection routes.',
        statusDescStart: 'Overall service health:',
        latencyDesc: 'Current average Jito bundle submission latency in ms.',
        routesDesc: 'Number of active protection routing paths.',
      },
      rateLimits: {
        bodyStart: 'API requests are rate-limited per API key. Limits vary by plan tier. Exceeded limits return',
        bodyEnd: '.',
        cols: { plan: 'Plan', rpm: 'Req / min', burst: 'Burst' },
      },
      settings: {
        bodyStart:
          'Manage your API keys, webhook endpoints, default protection levels, and rebate wallet addresses from the',
        bodyEnd: '. Programmatic configuration via API coming soon.',
        dashboardLink: 'Vigil Dashboard',
      },
    },
  },
  ko: {
    header: {
      getHelp: '도움말',
      mainSite: '메인 사이트',
      searchPlaceholder: '검색...',
      themeLight: '라이트 모드로 전환',
      themeDark: '다크 모드로 전환',
    },
    tabs: {
      documentation: '문서',
      apiReference: 'API 레퍼런스',
      docPlaceholder: '문서는 준비 중입니다. 지금은 API 레퍼런스 탭을 참고해 주세요.',
    },
    sidebar: {
      groups: {
        'Getting Started': '시작하기',
        'Core API': '핵심 API',
        'System': '시스템',
      },
      items: {
        introduction: '소개',
        authentication: '인증',
        'send-transaction': '트랜잭션 전송',
        'mev-receipt': 'MEV 영수증',
        'protection-status': '보호 상태',
        'rate-limits': '요청 한도',
        settings: '설정',
      },
      docGroups: {
        gettingStarted: '시작하기',
        detectorReadme: '샌드위치 감지기',
        detectorDesign: '감지 설계',
        rpcReadme: '보호 RPC',
      },
      gettingStartedPages: {
        overview: '개요',
        quickstart: '빠른 시작',
      },
      noResults: '일치하는 항목이 없습니다',
    },
    rightToc: {
      title: '이 페이지 목차',
    },
    content: {
      breadcrumb: '개요',
      copyPage: '페이지 복사',
      copied: '복사됨',
      baseUrl: '베이스 URL',
      header: '헤더',
      parameters: '파라미터',
      pathParameters: '경로 파라미터',
      responseFields: '응답 필드',
      introduction: {
        h1: 'Vigil API 레퍼런스',
        subtitle: 'Vigil API 개요',
        intro:
          'Vigil API는 Solana 위에서 MEV로부터 보호된 트랜잭션 전송, 실시간 실행 추적, 리베이트 정산을 프로그래밍 방식으로 제공합니다. 모든 트랜잭션이 보호된다는 확신을 가지고 빌드하세요.',
        executionTitle: '400ms 이하 실행',
        executionDesc:
          'Jito 번들과 멀티패스 전송으로 라우팅을 최적화해 트랜잭션이 400ms 안에 처리되도록 보장합니다.',
        rebateTitle: '리베이트 정산',
        rebateDesc:
          '획득된 MEV 리베이트를 사용자 지갑으로 자동 반환합니다. receipt 엔드포인트로 회수된 가치를 추적하세요.',
      },
      authentication: {
        bodyStart: '모든 API 요청은',
        bodyEnd: '헤더에 Bearer 토큰을 포함해야 합니다. 키는',
        dashboardLink: 'Vigil 대시보드',
        dot: '에서 발급할 수 있습니다.',
        warning:
          '시크릿 키를 안전하게 보관하세요. 클라이언트 코드나 공개 저장소에 노출하지 마세요.',
      },
      sendTransaction: {
        body:
          'MEV로부터 보호된 실행을 위해 직렬화된 트랜잭션을 제출합니다. 트랜잭션 해시와 보호 메타데이터를 반환합니다.',
        param1Desc: 'Base64로 인코딩된 직렬화 트랜잭션. 유효한 Solana 트랜잭션이어야 합니다.',
        param2DescStart: 'MEV 보호 레벨.',
        param3DescStart: '전송 전 preflight 시뮬레이션 생략 여부. 기본값:',
        codeLabelTs: 'TypeScript',
        codeLabel200: '200 OK — 응답',
      },
      receipt: {
        body:
          '제출된 트랜잭션의 MEV 보호 영수증을 조회합니다. 획득된 MEV 가치, 리베이트 금액, 정산 상태가 포함됩니다.',
        hashDesc: 'send 엔드포인트가 반환한 트랜잭션 서명.',
        mevDesc: '획득된 총 MEV 가치 (SOL 단위).',
        rebateDesc: '사용자 지갑으로 반환된 리베이트 (SOL 단위).',
        statusDescStart: '현재 상태:',
        codeLabel: 'MEV 영수증 — 응답',
      },
      protectionStatus: {
        body:
          '현재 지연시간과 활성 보호 경로를 포함한 MEV 보호 서비스의 실시간 상태를 확인합니다.',
        statusDescStart: '전체 서비스 상태:',
        latencyDesc: '현재 Jito 번들 평균 전송 지연시간 (ms).',
        routesDesc: '활성 보호 라우팅 경로 수.',
      },
      rateLimits: {
        bodyStart:
          'API 요청은 API 키 단위로 제한됩니다. 한도는 플랜 등급에 따라 다릅니다. 한도 초과 시 응답:',
        bodyEnd: '.',
        cols: { plan: '플랜', rpm: '분당 요청', burst: '버스트' },
      },
      settings: {
        bodyStart:
          'API 키, 웹훅 엔드포인트, 기본 보호 레벨, 리베이트 지갑 주소를',
        bodyEnd: '에서 관리하세요. API를 통한 프로그래밍 방식 설정은 추후 제공될 예정입니다.',
        dashboardLink: 'Vigil 대시보드',
      },
    },
  },
};

export type Strings = (typeof STRINGS)['en'];
