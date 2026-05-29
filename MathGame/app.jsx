// Mathemagicia — App entry. Mount the design canvas with iPhone artboards.

const { useState: _uS_a, useEffect: _uE_a } = React;

function PhoneArtboard({ initialScreen = 'cover', initialChapter = 0, initialLevel = 3, accent = '#4DEEEA' }) {
  return (
    <div style={{
      width: 402, height: 874,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'transparent',
    }}>
      <IOSDevice width={402} height={874} dark={true}>
        <div style={{ position:'absolute', inset: 0 }}>
          <Prototype
            initialScreen={initialScreen}
            initialChapter={initialChapter}
            initialLevel={initialLevel}
            paletteAccentOverride={accent} />
        </div>
      </IOSDevice>
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="flow" title="Mathemagicia" subtitle="Интерактивный поток — стартует с загрузочного экрана, дальше «Открыть» на обложке и пройдите главы. Внизу любого экрана есть кнопка ⋯ для прыжка между экранами.">
        <DCArtboard id="loading" label="Загрузка · LIBER I" width={460} height={920}>
          <PhoneArtboard initialScreen="loading" accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="main" label="Главный поток · Cover" width={460} height={920}>
          <PhoneArtboard initialScreen="cover" accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="chapters" label="Разворот гримуара" width={460} height={920}>
          <PhoneArtboard initialScreen="chapters" accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="settings" label="Настройки" width={460} height={920}>
          <PhoneArtboard initialScreen="settings" accent="#4DEEEA" />
        </DCArtboard>
      </DCSection>

      <DCSection id="puzzles" title="Четыре главы — четыре головоломки" subtitle="Каждая глава — отдельная механика. Все играбельны: тяните узлы, фигуры, числа, звёзды.">
        <DCArtboard id="ch-I"  label="I · Граф связей" width={460} height={920}>
          <PhoneArtboard initialScreen="game" initialChapter={0} initialLevel={3} accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="ch-II" label="II · Магический квадрат" width={460} height={920}>
          <PhoneArtboard initialScreen="game" initialChapter={1} initialLevel={1} accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="ch-III" label="III · Геометрия фигур" width={460} height={920}>
          <PhoneArtboard initialScreen="game" initialChapter={2} initialLevel={1} accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="ch-IV" label="IV · Созвездия чисел" width={460} height={920}>
          <PhoneArtboard initialScreen="game" initialChapter={3} initialLevel={1} accent="#4DEEEA" />
        </DCArtboard>
      </DCSection>

      <DCSection id="variants" title="Варианты акцента" subtitle="Один и тот же шелл, разные неоновые цвета. Эти же значения доступны в Настройках.">
        <DCArtboard id="v-mint" label="Mint · #70FFA0" width={460} height={920}>
          <PhoneArtboard initialScreen="game" initialChapter={0} initialLevel={3} accent="#70FFA0" />
        </DCArtboard>
        <DCArtboard id="v-violet" label="Violet · #B78CFF" width={460} height={920}>
          <PhoneArtboard initialScreen="game" initialChapter={3} initialLevel={1} accent="#b78cff" />
        </DCArtboard>
        <DCArtboard id="v-gold" label="Gold · win + dust" width={460} height={920}>
          <PhoneArtboard initialScreen="win" accent="#E5C158" />
        </DCArtboard>
      </DCSection>

      <DCSection id="modals" title="Модальные окна" subtitle="Подсказка через свечу и оверлей победы.">
        <DCArtboard id="hint" label="Подсказка · свеча" width={460} height={920}>
          <PhoneArtboard initialScreen="hint" accent="#4DEEEA" />
        </DCArtboard>
        <DCArtboard id="win" label="Победа" width={460} height={920}>
          <PhoneArtboard initialScreen="win" accent="#4DEEEA" />
        </DCArtboard>
      </DCSection>

      <DCPostIt top={40} left={40} rotate={-3} width={230}>
        Главы открыты на главе I. Чтобы пройти главу II — тяните числовые жетоны из нижнего ряда в пустые клетки; рамка светится золотом, когда строки/столбцы/диагональ дают 15. В главе IV соединяйте звёзды строго по возрастанию.
      </DCPostIt>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
