Erro: Plugin [id: 'com.android.application'] was not found...

Causa:
- O Android Gradle Plugin (AGP) não está resolvido no projeto raiz. Faltam repositórios (google()) e/ou a dependência do plugin no build.gradle/settings.gradle.
- Ou o Gradle Wrapper/JDK não são compatíveis com a versão do AGP.

Checklist de correção (raiz do projeto):
1) JDK 17 instalado (obrigatório para AGP 8.x).

2) gradle/wrapper/gradle-wrapper.properties
- Use uma versão de Gradle compatível com AGP 8.3.x:
  distributionUrl=https://services.gradle.org/distributions/gradle-8.6-all.zip

3) settings.gradle (raiz)
- Adicione:
  pluginManagement {
    repositories {
      google()
      mavenCentral()
      gradlePluginPortal()
    }
  }
  dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
      google()
      mavenCentral()
    }
  }
  rootProject.name = "edukidsspro"
  include(":app")

  // Se tiver outro módulo (ex.: capacitor-android), inclua:
  // include(":capacitor-android")
  // project(":capacitor-android").projectDir = new File(rootDir, "capacitor-android")

4) build.gradle (raiz)
- Opção A (buildscript clássico):
  buildscript {
    repositories { google(); mavenCentral() }
    dependencies { classpath "com.android.tools.build:gradle:8.3.2" }
  }
  allprojects {
    repositories { google(); mavenCentral() }
  }
  task clean(type: Delete) { delete rootProject.buildDir }

- Opção B (plugins DSL no raiz):
  plugins {
    id "com.android.application" version "8.3.2" apply false
  }
  // (E mantenha 'apply plugin: com.android.application' dentro de app/build.gradle)

5) app/build.gradle (módulo)
- No topo:
  apply plugin: "com.android.application"
- Garanta compileSdkVersion/targetSdkVersion 34 (ou as suas), repositories { google(); mavenCentral() } se o projeto estiver no padrão legacy.

Depois de salvar:
- No Android Studio: Sync Project with Gradle Files.
- Rode a tarefa Gradle: app > Tasks > build > bundleRelease.
- Saída do AAB: app/build/outputs/bundle/release/app-release.aab