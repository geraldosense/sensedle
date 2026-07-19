# Família Sense

Jogo de adivinhação sobre os membros da **Família Sense**, inspirado em jogos do tipo *Wordle* e [Narutodle Classic](https://narutodle.net/classic). Pesquisa nomes, compara atributos e descobre quem é o membro secreto — em três modos diferentes.

---

## Sobre o jogo

Em cada ronda, o jogo escolhe **um membro secreto** da família. O teu objectivo é descobrir quem é, usando pistas visuais e comparações entre tentativas.

O progresso (sequência de vitórias, estatísticas e sessões) fica guardado no **browser**, sem necessidade de conta.

---

## Modos de jogo

| Modo | Descrição |
|------|-----------|
| **Clássico** | Grelha de 10 colunas com pistas por atributo a cada palpite |
| **Silhueta** | Adivinha só pela silhueta da foto do membro |
| **Frases** | Lê uma frase real da família e descobre quem a disse |
| **Memória** | Em breve — modo com foto especial |

Podes alternar entre modos durante uma sessão pela barra de modos no topo do ecrã de jogo.

---

## Como funciona

### 1. Modo Clássico

1. Escreve o nome de um membro da família e submete.
2. Cada linha da grelha compara o teu palpite com o membro secreto em **10 colunas**:

   | Coluna | Tipo |
   |--------|------|
   | Membro | Nome |
   | Género | Masculino / feminino |
   | Papel | Papel na família |
   | Geração | 1.ª, 2.ª, 3.ª… |
   | Hobbies | Lista de hobbies |
   | Comida | Comida favorita |
   | Personalidade | Traços de personalidade |
   | Idade | Idade numérica |
   | Cor | Cor favorita |
   | Cômodo | Cômodo favorito da casa |

3. Interpreta as cores e setas para afinar o próximo palpite.
4. Ganhas quando **todas as colunas** ficam correctas.

#### Legenda de cores

| Cor | Significado |
|-----|-------------|
| Verde | Atributo **correcto** ou totalmente igual |
| Amarelo | **Parcial** — há sobreposição (ex.: hobby ou traço em comum) |
| Vermelho | **Errado** — sem correspondência |
| Setas ↑ ↓ | Em colunas ordenadas (Geração, Idade), indica se o valor correcto é maior ou menor |

#### Dicas progressivas

Se precisares de ajuda extra, desbloqueias dicas automáticas após várias tentativas erradas:

| Tentativas | Dica revelada |
|------------|---------------|
| 5 | Personalidade do membro secreto |
| 8 | Comida favorita |
| 12 | Papel na família |
| 20 | Botão para **revelar a resposta** |

---

### 2. Modo Silhueta

- Vês apenas a **silhueta** (contorno escuro) da foto do membro secreto.
- Cada palpite errado regista o membro escolhido no histórico.
- Ao acertar, a foto revela-se com animação de vitória.
- Podes **desistir** a qualquer momento para ver a resposta.

---

### 3. Modo Frases

- A **frase completa** aparece desde o início — são citações reais fornecidas pela família.
- O objectivo é descobrir **quem disse** aquela frase.
- Ao acertar, vês apenas o retrato de quem falou (sem grelha de atributos).
- Também podes desistir para revelar o autor.

> Só entram neste modo membros com frase registada em `src/data/quotes.ts`.

---

## Ciclo de ronda e cooldown

O jogo organiza-se em **ciclos de três modos**:

1. Completa uma vitória no **Clássico**
2. Completa uma vitória na **Silhueta**
3. Completa uma vitória em **Frases**

Quando os três objectivos estão concluídos (marca ✅ na barra de modos), inicia um **cooldown global de 5 minutos**. Durante esse tempo:

- Não é possível iniciar novas rondas
- Os botões de modo na página inicial ficam bloqueados
- Aparece uma contagem decrescente até à próxima ronda

Após o cooldown, o ciclo reinicia do zero.

---

## Sem repetições

Para manter as rondas variadas, cada modo usa um **baralho embaralhado** de membros válidos:

- Não repete o mesmo membro **duas vezes seguidas**
- Só volta a sortear alguém depois de **percorrer todo o pool** desse modo
- No modo Frases, o pool inclui apenas membros com frase registada
- O baralho reinicia quando termina o cooldown global do ciclo

---

## Partilhar e estatísticas

- **Partilhar resultado** — gera texto com grelha de cores (modo Clássico/Silhueta) ou resumo da tentativa (Frases), pronto para WhatsApp ou redes sociais
- **Sequência** — número de vitórias consecutivas guardado localmente
- **Estatísticas** — vitórias, jogos totais e melhor sequência

---

## Stack técnico

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- Persistência em `localStorage` (sem backend)

---

## Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm

### Instalação e execução

```bash
git clone https://github.com/geraldosense/sensedle.git
cd sensedle
npm install
npm run dev
```

Abre o URL indicado no terminal (normalmente `http://localhost:5173`).

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Pré-visualizar o build |
| `npm run lint` | Verificar código com Oxlint |

---

## Estrutura do projecto

```
src/
├── components/       # UI (grelha, modais, modos, silhueta, frases…)
├── data/
│   ├── members.ts    # Membros da família e atributos
│   ├── quotes.ts     # Frases reais por membro
│   ├── gameModes.ts  # Configuração visual dos modos
│   └── social.ts     # Links das redes sociais
├── lib/
│   ├── compare.ts    # Lógica de comparação entre palpites
│   ├── cooldown.ts   # Ciclo de 3 modos e cooldown global
│   ├── freePlay.ts   # Rotação anti-repetição por modo
│   └── storage.ts    # Sessões e progresso local
├── pages/
│   ├── HomePage.tsx  # Ecrã inicial e selecção de modo
│   └── ClassicPage.tsx # Jogo principal
└── types/game.ts     # Tipos e definição das colunas
public/images/        # Fotos dos membros e assets visuais
```

---

## Adicionar membros da família

Edita `src/data/members.ts` e acrescenta uma entrada ao array `FAMILY_MEMBERS`:

```typescript
{
  id: 'identificador-unico',
  name: 'Nome Completo',
  aliases: ['Apelido', 'Outro nome'],
  image: '/images/members/foto.png',
  gender: 'masculino',
  role: 'filho',
  generation: 2,
  hobbies: ['hobby1', 'hobby2'],
  favoriteFood: 'Comida favorita',
  personality: ['trait1', 'trait2'],
  age: 30,
  favoriteColor: 'Azul',
  favoriteRoom: 'Sala',
}
```

Coloca a imagem em `public/images/members/`. Campos opcionais úteis: `education`, `profession`, `dream`, `ageLabel`.

---

## Adicionar frases (modo Frases)

Regista frases **reais** em `src/data/quotes.ts`, associadas ao `id` do membro:

```typescript
export const MEMBER_QUOTES: Record<string, MemberQuote> = {
  'identificador-unico': {
    text: 'Frase exacta dita pelo membro',
  },
};
```

Só membros com entrada aqui aparecem no modo Frases.

---

## Redes sociais

- [Instagram — @geraldo_sense](https://www.instagram.com/geraldo_sense/?hl=pt)
- [Facebook — Geraldo De Assunção](https://www.facebook.com/people/Geraldo-De-Assun%C3%A7%C3%A3o/pfbid0ErHCiVJcz4uHW5LSj6CiNvqTPtmWJEPRSA9itdaGkF6CuQ5XW5uHNiunUe1SyRxRl/)
- [TikTok — @geraldo.sense](https://www.tiktok.com/@geraldo.sense)

---

## Licença

Projecto privado da Família Sense. Todos os direitos reservados.
