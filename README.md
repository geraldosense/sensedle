# Família Sense

Jogo diário de adivinhação inspirado no [Narutodle Classic](https://narutodle.net/classic), mas sobre a tua família.

## Como funciona

- Cada dia, um membro secreto da família é escolhido
- Escreve o nome de um membro e submete
- A grelha de 10 colunas mostra pistas: verde (correto), amarelo (parcial), vermelho (errado)
- Dicas progressivas desbloqueiam após 5, 8 e 12 tentativas erradas
- Sequência de vitórias guardada no browser

## Desenvolvimento

```bash
npm install
npm run dev
```

## Adicionar membros da família

Edita `src/data/members.ts` e adiciona cada membro ao array `FAMILY_MEMBERS`:

```typescript
{
  id: 'unique-id',
  name: 'Nome',
  aliases: ['Apelido'],
  image: '/images/nome.webp',
  gender: 'masculino',
  role: 'pai',
  generation: 1,
  hobbies: ['hobby1', 'hobby2'],
  favoriteFood: 'Comida favorita',
  personality: ['trait1', 'trait2'],
  age: 30,
  favoriteColor: 'Azul',
  favoriteRoom: 'Sala',
}
```

Coloca as imagens em `public/images/`.
# sensedle
