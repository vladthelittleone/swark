---
title: Расскажите о принципах работы Module Federation в Webpack?
keywords: module federation
complexity: 3
links: ✅
content: ✅
---

## Терминология

- Host (consumer) - bundle, который первый инициализировался во время загрузки страницы (root);
- Remote (consumable) – другой bundle, чьи части может импортировать host (leaf);
- Omnidirectional host – bundle, который одновременно может быть и host, и remote (внутренний node);
- Exposed Modules - модули, которые будут доступны другим микрофронтендам;
- Shared Modules - модули, которые могут общими для нескольких микрофронтендов (react, redux).

![host-remote](img/host-remote.png)

Каждая часть Module Federation имеет независимый build.

## Процессы внутри Module Federation 

- Контейнеры пробрасывают модули в асинхронном виде. 
- Все контейнеры могут класть shared-модули в shared scope. 
- Module Federation резолвит одинаковые зависимости и предоставит shared модуль наивысшей версии.

Приведем пример работы:

![mfe-process](img/mfe-process.png)

1. Первым делом подключается основная webpack-сборка;
2. И параллельно происходи подключение remoteEntry.js - логики с Remote;
3. Подгрузка chunk'ов для App;
4. Подгрузка chunk'ов происходит асинхронно;
5. Добавление в scope react определенной версии;
6. App запрашивает определенный **компонент** у scope;
7. Scope отслеживает общие модули и предоставляет информацию о них для Remote. В нашем случае это React. Remote решает нужно ли ему использовать текущую версию или грузить другую версию;
8. Scope запрашивает нужный **компонент** у Remote; 
9. Подгружает chunk'и (не общие), которые нужны для данного **компонента**; 
10. Асинхронно отдает нужный **компонент** в scope;
11. Асинхронно отдаем нужный **компонент** в App.
   
Scope - это по сути прокси объект для Remote, с помощью которого мы асинхронно получаем доступ к модулям.

## Основные блоки

- ModuleFederationPlugin - позволяет сборке предоставлять модули другим сборками или использовать модули из других сборок во время выполнения. Объединяет в себе `ContainerPlugin` and `ContainerReferencePlugin`.
- ContainerPlugin - создает контейнер с `exposed` модулями (по сути это Remote).
- ContainerReferencePlugin - позволяет импортировать remote-модули (по сути это Host).
- SharedPlugin - отвечает за shared-модули.

## Проблемы с Module Federation

- Как решить проблему версионирования и нарушение контракта;
- Как правильно организовать роутинг;
- Как решать проблемы с сетью;
- Нет четкого гайда о том, как организовать взаимодействие между микрофронтендами;
- Как организовать изоляцию стилей;
- Как организовать тестирование, если меняется контракт;
- Сложность с SSR.

## Оркестрация

- Everygreen 
    - Всегда используем последнюю версию контейнера;
    - Нет возможности сделать staging/production и т.д.
- Managed
    - Приложение _"лочит"_ версии всех контейнеров;
    - Есть возможность выкатывать staging/production и т.д.
    
## Дополнительно
- [Павел Черторогов — Революция в микрофронтендах, module federation, Webpack 5](https://youtu.be/pcY8-pDGLkI) и [слайды](https://nodkz.github.io/conf-talks/talks/2020.10.26-webpack-federation/index.html#/),
- [Module Federation in Webpack 5 - Tobias Koppers](https://youtu.be/gmUm7CTsNhk) и [слайды](https://github.com/sokra/slides/blob/master/content/ModuleFederationWebpack5.md),
- [Webpack 5 Module Federation - A look at the source code and how it works](https://www.youtube.com/watch?v=HDRIvks0yyk).