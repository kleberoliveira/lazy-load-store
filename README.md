# 📦 lazy-load-store

Armazene facilmente valores grandes de objetos aninhados em arquivos com recuperação automática e manuseio de referências.

---

## 🚀 Instalação

```bash
npm install lazy-load-store
```

---

## 📖 Uso

### ✅ **Exemplo básico**

```ts
import { Storage } from "lazy-load-store";

// Cria ou recupera a instância singleton
const storage = new Storage();

// Armazena uma string pequena diretamente
storage.smallValue = "Hello, world!";
console.log(storage.smallValue); // "Hello, world!"

// Armazena uma string grande em arquivo
const largeString = "A".repeat(1500); // Excede o limite para salvar em arquivo
storage.largeValue = largeString;

console.log(storage.largeValue); // "A..." (conteúdo recuperado do arquivo)
console.log(storage.getFileName("largeValue")); // "largeValue_<timestamp>.txt"
```

---

### 🗂️ **Exemplo com objetos aninhados**

```ts
const storage = new Storage();

storage.nested = {
  key1: "B".repeat(2000), // Salvo em arquivo
  key2: "small value", // Armazenado diretamente
};

console.log(storage.nested.key1); // Conteúdo do arquivo
console.log(storage.nested.key2); // "small value"
console.log(storage.getFileName("nested"));
// { key1: "nested_key1_<timestamp>.txt" }
```

---

### 📂 **Definindo o local de armazenamento**

Agora é possível informar o diretório onde os arquivos serão salvos ao instanciar o `Storage`:

```ts
import { Storage } from "lazy-load-store";

// Cria uma nova instância que salva os arquivos no diretório "./custom-storage"
const customStorage = new Storage("./custom-storage");

customStorage.largeValue = "C".repeat(2000);
console.log(customStorage.getFileName("largeValue")); // Arquivo salvo em ./custom-storage
```

Caso não seja informado, o diretório padrão é o local de execução do processo.

---

### 🧹 **Limpeza e destruição**

```ts
const storage = new Storage();

// Remove arquivos criados e reseta o storage
storage.destroy();
```

## 🧪 Testes

```bash
npm test
```

---

## 🛡️ API

### `storage: Storage`

Instância singleton para manipulação de dados.

#### 📥 **Métodos:**

- `storage[key] = value`: Define um valor (salva em arquivo se for grande).
- `storage[key]`: Recupera o valor, lendo o arquivo se necessário.
- `storage.getFileName(property: string)`: Obtém o nome do arquivo salvo.
- `storage.destroy()`: Remove arquivos criados e limpa o cache.
- `new Storage(basePath?: string)`: Cria uma instância com um diretório de armazenamento customizado.

---

## 📝 Licença

MIT License © 2025
