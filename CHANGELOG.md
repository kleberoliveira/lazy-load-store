## [1.5.0](https://github.com/kleberoliveira/lazy-load-store/compare/v1.4.1...v1.5.0) (2025-03-18)

### Features

* **storage:** refatorar método getAllData para processar adequadamente todos os tipos de dados retornados. Adicionar lógica para preservar estrutura de array e manipular objetos aninhados com grandes strings. Ajustar testes para validar comportamento esperado das modificações. ([645fb72](https://github.com/kleberoliveira/lazy-load-store/commit/645fb72ddee8aab8f0204425fe175ffe7a686bd0))

## [1.4.1](https://github.com/kleberoliveira/lazy-load-store/compare/v1.4.0...v1.4.1) (2025-03-13)

### Bug Fixes

* **storage:** garantir retorno do callback no acesso a propriedades ([dedf430](https://github.com/kleberoliveira/lazy-load-store/commit/dedf430989d733ea1c9cdb821d5d8eaff6baca52))
* **utils:** atualizar type-guard para excluir Date e RegExp ([00298b6](https://github.com/kleberoliveira/lazy-load-store/commit/00298b68cfcd7ab08f304405f747cb516b319496))

## [1.4.0](https://github.com/kleberoliveira/lazy-load-store/compare/v1.3.0...v1.4.0) (2025-03-10)

### Features

* **storage:** adicionar suporte a callback de acesso a propriedades ([17560c8](https://github.com/kleberoliveira/lazy-load-store/commit/17560c89e73f5c3857b0d7c3ee28dff0ab1b1b7d))

## [1.3.0](https://github.com/kleberoliveira/lazy-load-store/compare/v1.2.0...v1.3.0) (2025-03-09)

### Features

* **storage:** modularizar contexto de armazenamento e melhorar gerenciamento de proxy ([fb01f1a](https://github.com/kleberoliveira/lazy-load-store/commit/fb01f1a6a487bf167770b4f09fa814f5fb815919))

### Bug Fixes

* **storage:** ajustar visibilidade de propriedade e atualizar teste de coleta de arquivos ([0f8d025](https://github.com/kleberoliveira/lazy-load-store/commit/0f8d0251002c814e11eae92fbdd3fc2dc1f1a3cf))

## [1.2.0](https://github.com/kleberoliveira/lazy-load-store/compare/v1.1.2...v1.2.0) (2025-03-07)

### Features

* **storage:** modularizar e melhorar tratamento de objetos aninhados ([e14271b](https://github.com/kleberoliveira/lazy-load-store/commit/e14271b8a3197b6d8667d8e6ebd8dd85bf7e93bf))

## [1.1.2](https://github.com/kleberoliveira/lazy-load-store/compare/v1.1.1...v1.1.2) (2025-02-23)

### Bug Fixes

* **storage:** refatorar construtor da classe Storage e inicialização de propriedades ([6d078b8](https://github.com/kleberoliveira/lazy-load-store/commit/6d078b8df126895ec50920ed158b18660858e147))

## [1.1.1](https://github.com/kleberoliveira/lazy-load-store/compare/v1.1.0...v1.1.1) (2025-02-23)

### Bug Fixes

* **tsconfig:** atualizar configuração do TypeScript ([c372140](https://github.com/kleberoliveira/lazy-load-store/commit/c3721402c2e5714539b664356b097dcb855b53c9))

## [1.1.0](https://github.com/kleberoliveira/lazy-load-store/compare/v1.0.0...v1.1.0) (2025-02-23)

### Features

* **storage:** adicionar suporte à personalização do diretório de armazenamento ([54a3df3](https://github.com/kleberoliveira/lazy-load-store/commit/54a3df31ab0388551aa3e733734350c1a4643790))

## 1.0.0 (2025-02-23)

### Features

* **core:** implementa funcionalidade de armazenamento com suporte a arquivos ([11045e3](https://github.com/kleberoliveira/lazy-load-store/commit/11045e37a233832fec117e8bef5ce8db07aeaf87))
* **project:** initialize project structure and configurations ([552d035](https://github.com/kleberoliveira/lazy-load-store/commit/552d0355721d6f3a0e7231a0caf03963dae979c9))
