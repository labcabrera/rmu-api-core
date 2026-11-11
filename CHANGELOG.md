# [0.9.0](https://github.com/labcabrera/rmu-api-core/compare/0.8.0...0.9.0) (2026-11-11)


* feat!: alchemy tables and materials leave this api ([adab006](https://github.com/labcabrera/rmu-api-core/commit/adab0068736b896b4344d5e9f87da04add233811))


### Features

* **access:** realm shares and access levels inherited by races and enumerations ([d0d7633](https://github.com/labcabrera/rmu-api-core/commit/d0d7633c35d11fe018b9b151c8d9ea5f7bd02008))
* admins share realms with their own friends ([cb343fc](https://github.com/labcabrera/rmu-api-core/commit/cb343fcc5ebf7bda7f23d77dc8eafff07705c532))
* copy a race into a writable realm (spec 074) ([a24f121](https://github.com/labcabrera/rmu-api-core/commit/a24f121d9861489b49e0cb65e508ca7c27a71a54))
* realm access map for other apis ([1d887b1](https://github.com/labcabrera/rmu-api-core/commit/1d887b1b46486aaf35853a726f7df4d40ff60d44))
* **realms:** follow the new name of a user in the shares ([980f1e1](https://github.com/labcabrera/rmu-api-core/commit/980f1e1cd8c90304f4311641d00f0f86c72acb06))
* **realms:** members of strategic games read the realm, access endpoint ([ffb31fa](https://github.com/labcabrera/rmu-api-core/commit/ffb31faa451227b408d57448cb735f1aad79cc89))
* **realms:** share a realm with friends and revoke on a broken friendship ([a8cde0b](https://github.com/labcabrera/rmu-api-core/commit/a8cde0b8518270f6e9d9383ac844cfdca1a26e19))
* treasure tables require Treasure Law access ([ea3165b](https://github.com/labcabrera/rmu-api-core/commit/ea3165b4fe669001ba912bcfd15303cab4471410))


### BREAKING CHANGES

* GET /v1/alchemy-tables moves to rmu-api-spells

and GET /v1/materials to rmu-api-items (workspace spec 096).

# [0.8.0](https://github.com/labcabrera/rmu-api-core/compare/0.7.9...0.8.0) (2026-11-02)


* feat(enumerations)!: normalized keys with a display name ([c8024b5](https://github.com/labcabrera/rmu-api-core/commit/c8024b514b650c19f2044875679375241be0b724))


### Bug Fixes

* accept only public or private as access type (spec 044) ([d1d17cf](https://github.com/labcabrera/rmu-api-core/commit/d1d17cfd96bb2e734360cfc3ba1faca4b6892cbc))
* answer 200 to a resistance roll calculation (spec 044) ([8c44a92](https://github.com/labcabrera/rmu-api-core/commit/8c44a92e3a76081332d463295c897748cefe8b5d))
* answer 400 to a non-integer armor type id (spec 044) ([7357a6b](https://github.com/labcabrera/rmu-api-core/commit/7357a6b261dc51a9e9cfd671ccd0cbebab1cc778))
* answer 400 to an invalid maneuver roll (spec 044) ([9e2b242](https://github.com/labcabrera/rmu-api-core/commit/9e2b242d4bcca19972d70a30aa355051551242cf))
* check permissions when creating races, enumerations, traits and skill categories (spec 044) ([1e96da8](https://github.com/labcabrera/rmu-api-core/commit/1e96da8e476c1e816363322b22aae86496752afe))
* check the target realm when an enumeration update moves it ([c794253](https://github.com/labcabrera/rmu-api-core/commit/c7942535e043f925113e4f68b7fcead7b470f985))
* correct race sub-entity removal, the duplicated operationId and unbounded page size (spec 015) ([25196d7](https://github.com/labcabrera/rmu-api-core/commit/25196d723515b5d4b9cb04287cf7224c5954feab))
* fill the absolute maneuver penalty and bonus from its effects ([0200bf4](https://github.com/labcabrera/rmu-api-core/commit/0200bf419948ba2f7a8f85b51abf6e4fef0821db))
* **http:** leave the health check out of the OpenAPI security and the query out of the error path ([636b3c2](https://github.com/labcabrera/rmu-api-core/commit/636b3c21fc7d51e1b97e3e538bacad9303ef2d2f))
* include the realm in the duplicate check of an enumeration update (spec 044) ([d7c9a2e](https://github.com/labcabrera/rmu-api-core/commit/d7c9a2e815f6f62f9b71bf1288074e8e07a10861))
* let an enumeration update clear its description and image (spec 044) ([7298a1f](https://github.com/labcabrera/rmu-api-core/commit/7298a1f7800a7b40f0ff4382072c8ae683aad053))
* let every authenticated user read and list traits (spec 044) ([04c5ad7](https://github.com/labcabrera/rmu-api-core/commit/04c5ad788cc9e82f9c7645efeda742133d4694fe))
* make the crafting penaltyUntilAbsoluteSuccess negative (spec 044) ([438de6b](https://github.com/labcabrera/rmu-api-core/commit/438de6bf188f24296c3a13fb50f3a77076647d25))
* maneuver modifier key check, clearing realm texts, trait ids and failed starts ([6b04b80](https://github.com/labcabrera/rmu-api-core/commit/6b04b8097b1a525bb475e64b3033bcc92ac9bb51))
* **races:** pass the user id to the race ownership checks ([cfe5455](https://github.com/labcabrera/rmu-api-core/commit/cfe54551bb1f9b91b095616343c2ee581c5a584f))
* reject an empty name when updating cultures, traits and races (spec 044) ([c363349](https://github.com/labcabrera/rmu-api-core/commit/c36334994d79b92ab5be5f4e098ce16dcaabe837))
* **shared:** harden the RSQL parser (spec 015) ([8a2455a](https://github.com/labcabrera/rmu-api-core/commit/8a2455ab6ade5a164c5008cb5c88d478b1b95b14))
* **trading-tables:** declare the Number type of the nullable negotiation fields ([32fb870](https://github.com/labcabrera/rmu-api-core/commit/32fb870afb041010bd860e03dfeeb2ef1a2ceedf))
* validate request bodies without implicit conversion (spec 044) ([790d541](https://github.com/labcabrera/rmu-api-core/commit/790d5416120499b0bf37169184c080e76f48ca31))
* validate the category and specialization of a trait (spec 044) ([8e21269](https://github.com/labcabrera/rmu-api-core/commit/8e2126929ae0e743a50b88dd2154df3490925be2))
* validate the modifiers of a resistance roll (spec 044) ([b0d1056](https://github.com/labcabrera/rmu-api-core/commit/b0d1056cc00514d8680877648c565144f8a0e070))
* validate the nested objects of a race PATCH (spec 044) ([9fcbc8f](https://github.com/labcabrera/rmu-api-core/commit/9fcbc8fb61036eb7d28fcfb9b57ac6fb2096dd50))
* validate the skill costs of a profession (spec 044) ([c0e1a87](https://github.com/labcabrera/rmu-api-core/commit/c0e1a875ca3c061fd814c41cad8788956c788b0e))


### Features

* add the fighting styles catalog (spec 032) ([eac59fb](https://github.com/labcabrera/rmu-api-core/commit/eac59fb7d6ac91b83a83ddd9de4d9084c727d070))
* **alchemy-tables:** read-only alchemy tables endpoint (spec 064) ([5aaab39](https://github.com/labcabrera/rmu-api-core/commit/5aaab392b8a5eee172f3a9a8e541b69ee0782fbf))
* **auth:** validate token issuer and audience ([3f5fc7f](https://github.com/labcabrera/rmu-api-core/commit/3f5fc7f93990c7cc0444d0bcb381479ec638bba2))
* combat healing and fear fields in the healing and psychology tables ([7de11c1](https://github.com/labcabrera/rmu-api-core/commit/7de11c199b851f1899ddb3bc43f03c55f3a29843))
* **cultures:** typed culture skill ranks and development cost ([1caa80e](https://github.com/labcabrera/rmu-api-core/commit/1caa80ebdc88318f441c8edc34f89ec3fb1826b0))
* entity source on cultures, maneuver modifiers, races, realms, skills and traits (spec 063) ([ba944a1](https://github.com/labcabrera/rmu-api-core/commit/ba944a1566fd6b2d1cc5f2b827640a69d2b77ace))
* **enumerations:** add the unarmed attack categories ([5670454](https://github.com/labcabrera/rmu-api-core/commit/5670454071ccb46c618ed250aeaf9bfa1e290a85))
* **events:** publish domain events through one awaited Kafka publisher (spec 015) ([dbb42f0](https://github.com/labcabrera/rmu-api-core/commit/dbb42f06abe7b09f671a5857b9d8a61ceb39af8d))
* **events:** take the event producer from RMU_KAFKA_CLIENT_ID ([f4fccbd](https://github.com/labcabrera/rmu-api-core/commit/f4fccbdaf1c007cc67b99a208656fed8e272feb8))
* generic realms that only an admin sets ([8f30585](https://github.com/labcabrera/rmu-api-core/commit/8f305853b7dbf8978e232e23aa2ce899c9c57fd4))
* get /v1/info with the name and version of the api ([c6f31d7](https://github.com/labcabrera/rmu-api-core/commit/c6f31d7c087e688db60d426722a74405bb8a42c2))
* **healing-tables:** expose the healing tables (spec 013) ([704dff5](https://github.com/labcabrera/rmu-api-core/commit/704dff5717fc79565c8aff71c065d32c25e57b72))
* **healing-tables:** serve the treatment difficulties by procedure, injury type and severity ([01e8361](https://github.com/labcabrera/rmu-api-core/commit/01e836100c015a212ba25b49ee8a4487ebd585de))
* **http:** one error format and the indexes the listings need (spec 015) ([2606c49](https://github.com/labcabrera/rmu-api-core/commit/2606c49789139db32c1834cd7cb95df7a484dee7))
* **maneuver-modifiers:** reference-only modifiers ([716320f](https://github.com/labcabrera/rmu-api-core/commit/716320fe08acdfc2c6ea89bb8950c8eaa8d49089))
* **maneuvers:** maneuver profiles, skill modifier catalog and stored result tables ([730a83b](https://github.com/labcabrera/rmu-api-core/commit/730a83bb9d4c55ec5daea799c25fbf7fe0fa9aba))
* **maneuvers:** spanish translations of maneuver result texts ([cfa595d](https://github.com/labcabrera/rmu-api-core/commit/cfa595d537dfbfcbc16fd19292b749b316fde8c4))
* optimistic concurrency, error codes and a typed base repository ([b237462](https://github.com/labcabrera/rmu-api-core/commit/b237462ed201c3a7f947ecfe29ee7333c380e25d))
* **poison-tables:** general poison effects by category and severity (spec 042) ([5d9fe0d](https://github.com/labcabrera/rmu-api-core/commit/5d9fe0db0c97bdc53a423e03b0150d8cb79233de))
* professions, effect types and enumerations take the entity source from the request (spec 063) ([6ef3e52](https://github.com/labcabrera/rmu-api-core/commit/6ef3e523d5fe30802b25acba7e5e7ac151004935))
* **professions:** optional base list limit (spec 064) ([34aa16f](https://github.com/labcabrera/rmu-api-core/commit/34aa16fb74d57c39407c8d12af67e4d56ae12603))
* **psychology-tables:** add GET /v1/psychology-tables ([6ac83ef](https://github.com/labcabrera/rmu-api-core/commit/6ac83efa324d14e6ec6562575cbd76a57777701c))
* publish profession created and updated events (spec 044) ([0cf40e5](https://github.com/labcabrera/rmu-api-core/commit/0cf40e555d5be61d9541a6966934be12dc5d2db3))
* **realms:** only an admin deletes a realm with system races (spec 063) ([8167007](https://github.com/labcabrera/rmu-api-core/commit/8167007d5ec29f39090a99ee9750eeee5b0862dd))
* rule text of the fighting style abilities (spec 032) ([bf45722](https://github.com/labcabrera/rmu-api-core/commit/bf457223166226d0864f30c746a8d84cda98f6fe))
* security headers, request limit, CORS allow-list and page size limits ([70d84c9](https://github.com/labcabrera/rmu-api-core/commit/70d84c9c19385d5af222dc628cca618d1535165f))
* serve the taxes and tolls with the trading tables (spec 062) ([fb85471](https://github.com/labcabrera/rmu-api-core/commit/fb8547185b9f7dc80bf7f98f3c3f485a6d5f7206))
* **shared:** detect unchanged aggregates in the base and restore the version on update ([091d1ae](https://github.com/labcabrera/rmu-api-core/commit/091d1aed06cd4f3bdf23f3d262e689833e3388dc)), closes [#storedVersion](https://github.com/labcabrera/rmu-api-core/issues/storedVersion)
* **skill-categories:** add the maneuver result kind (standard, morale, price) ([29cdb4b](https://github.com/labcabrera/rmu-api-core/commit/29cdb4bae65639d5d71cd77c83413d052f397cb4))
* **skill-difficulties:** difficulty guides per skill and optional specialization ([292c357](https://github.com/labcabrera/rmu-api-core/commit/292c35730c9a754c20256160d92fea5072b51288))
* superior materials for crafting (spec 043) ([9bf92d8](https://github.com/labcabrera/rmu-api-core/commit/9bf92d8337f5417e7f0c69dcb830388f1a61b7cb))
* **trading:** trading tables and Trading modifier contexts ([9fe500c](https://github.com/labcabrera/rmu-api-core/commit/9fe500c1d30efd2e1802d005e64bc8cee3031200))
* **traits:** add weapon type specializations ([7baa63f](https://github.com/labcabrera/rmu-api-core/commit/7baa63f45f84215ac12fe9110f8fe079e00d1b09))
* **traits:** talent category, prerequisites, flaws and source (spec 039) ([283d521](https://github.com/labcabrera/rmu-api-core/commit/283d521798adb6153bc53c40332d46637f1fd165))
* **treasure-tables:** pass the extra parts of the import through (spec 067) ([913f18c](https://github.com/labcabrera/rmu-api-core/commit/913f18ccdc0ff2b070d2278e333bae50023c7065))
* **treasure-tables:** treasure and standard pricing tables in v1/treasure-tables (spec 067) ([94bda1d](https://github.com/labcabrera/rmu-api-core/commit/94bda1dafa9e37083a3353d8853e19b82623274e))


### BREAKING CHANGES

* enumeration keys can no longer change, and creating an
enumeration without a realm needs the admin role.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>

## [0.7.9](https://github.com/labcabrera/rmu-api-core/compare/0.7.8...0.7.9) (2026-10-04)
