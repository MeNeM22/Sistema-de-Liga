# Sistema de Gestión de Liga - API REST

Este proyecto es una API REST robusta desarrollada en **Node.js** y **TypeScript** para la gestión de equipos, jugadores y presupuestos de una liga deportiva. 

El foco principal de este repositorio no es solo la funcionalidad, sino la **calidad del código y el diseño arquitectónico**. Fue construido desde cero aplicando principios de ingeniería de software avanzados para garantizar un sistema escalable, testeable y mantenible.

## 🚀 Conceptos y Prácticas Aplicadas

* **Test-Driven Development (TDD) & BDD:** El desarrollo fue guiado completamente por pruebas (más de 80 commits reflejan el ciclo *Red-Green-Refactor*). Se utilizaron escenarios Gherkin para definir el comportamiento (Behavior-Driven Development) asegurando que las reglas de negocio complejas (cálculos fiscales, poder ofensivo/defensivo) funcionen al 100%.
* **Arquitectura Hexagonal (Puertos y Adaptadores):** Separación estricta de responsabilidades. El dominio central está completamente aislado de la base de datos y del framework web.
  * **Capa de Dominio:** Entidades puras y reglas de negocio.
  * **Casos de Uso / Orquestador:** `SistemaLiga` maneja el flujo de la aplicación.
  * **Adaptadores:** Express.js maneja la capa Web (Input) y Redis maneja la persistencia (Output).
* **Domain-Driven Design (DDD):** Entidades ricas (`Liga`, `Equipo`, `Jugador`, `Posicion`) que encapsulan su propio estado y validaciones. En lugar de errores genéricos, se diseñaron excepciones de dominio específicas (ej: `LigaEquipoNoEncontradoError`, `EquipoPresupuestoExcedidoError`).
* **Manejo de Errores y RESTful API:** Implementación de controladores defensivos con `try/catch`, mapeando correctamente las excepciones del dominio a los códigos de estado HTTP correspondientes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

## 🛠️ Stack Tecnológico

* **Lenguaje:** TypeScript / Node.js
* **Framework Web:** Express.js
* **Persistencia:** Redis (Base de datos en memoria)
* **Testing:** Jest (Tests unitarios y de integración)

## ⚙️ Estructura del Proyecto
El código fuente está organizado respetando las capas de la arquitectura hexagonal:
- `/dominio`: Entidades puras, clases de error personalizadas, fábricas y puertos (interfaces).
- `/adaptadores`: Implementación del repositorio de Redis y configuración del cliente.
- `sistema-liga.ts`: Orquestador principal (Caso de Uso).
- `programa.ts`: Configuración de rutas y servidor Express.

## 📝 Reglas de Negocio Destacadas
- Cálculo dinámico del presupuesto ejecutado aplicando un 10% de cargas fiscales.
- Evaluación algorítmica del poder ofensivo y defensivo de un equipo basado en la potencialidad y posición específica de cada jugador (Arquero, Defensor, Mediocampista, Delantero).
- Restricciones de plantilla estables (límite de jugadores, presupuesto máximo, tope de arqueros).
