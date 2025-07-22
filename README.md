# React ilə Softphone UI Simulyasiyası

Bu layihə, frontend proqramçı üçün verilmiş kodlaşdırma tapşırığı əsasında yaradılmışdır. Tətbiq, WebRTC API-lərindən istifadə edərək sadə bir softphone interfeysini simulyasiya edir.

## Əsas Xüsusiyyətlər

- ✅ **Mikrofon Girişi:** `getUserMedia` API-si ilə istifadəçinin mikrofonuna təhlükəsiz giriş.
- ✅ **Zəng İdarəetməsi:** Zəngi başlatmaq, səssizə almaq/səsliyə almaq və sonlandırmaq üçün funksional düymələr.
- ✅ **Dinamik Status:** Zəngin hazırkı vəziyyətinin (gözləyir, bağlanır, davam edir, sonlandı) göstərilməsi.
- ✅ **Real-vaxt Taymeri:** Zəng müddətinin `mm:ss` formatında canlı göstərilməsi.
- ✅ **Responsiv Dizayn:** Bütün düymələr və elementlər mobil və desktop ekranlar üçün tam responsivdir.
- ✅ **Brauzer Loqları:** Media axını ilə bağlı bütün əsas hadisələr brauzerin konsolunda qeyd olunur.

## İstifadə Olunan Texnologiyalar

- **React 19:** Müasir UI kitabxanası.
- **Vite:** Sürətli development və build aləti.
- **TypeScript:** Koda tip təhlükəsizliyi əlavə edir.
- **Tailwind CSS:** Utility-first CSS framevorku.
- **WebRTC (getUserMedia):** Brauzerlərin daxili media API-si.

## Layihəni Necə İşə Salmalı?

Layihəni lokal kompüterinizdə yoxlamaq üçün aşağıdakı addımları izləyin:

1.  **Repozitoriyanı klonlayın:**
    ```
    git clone https://github.com/OrkhanNajaf1i/react-softphone-task.git
    ```

2.  **Proyekt qovluğuna daxil olun:**
    ```
    cd react-softphone-task
    ```

3.  **Lazımi paketləri quraşdırın:**
    ```
    npm install
    ```

4.  **Development server-i işə salın:**
    ```
    npm run dev
    ```

5.  **Brauzerdə açın:**
    Terminalda göstərilən linkə (adətən `http://localhost:5173`) daxil olaraq tətbiqi istifadə edə bilərsiniz.

