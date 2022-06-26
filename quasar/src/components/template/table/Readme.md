# Компонент таблицы

забрать отюда четыре файла  
TablePanel  
tableColumnList  
tableFunc  
TableBodyMenu

Props:

    :tableName - "tableName" - имя таблицы для обслуживания
    :rows="rows" - [] строки таблицы
    :columns="columns" [] - колонки
    :columnsVisibleTemplate - "columnsVisibleTemplate" [] - какие показываь колонки, а какие в выбор оставить
    :tableBodyMenu="tableBodyMenu" - null - компонент, обработки меню правой мыши
    :tableFunc - Function функция, ее подключаем по месту
    noExpandPanel - скрыть расширение заголовка для управления
    noTitlePanel - скрыть заголовок таблицы
    noTopBtn - не показывать кнопку с плюсом
    noTopFind - не показывать поле поиска
    noTopColumnSelect - не показывать выбор колонок
    noInfoBtn - убрать кнопку Info из строки
    yesBtnEdit - показывать кнопку редактирования
    yesBtnDelete - показывать кнопку удаления
    noEditTable - удаляет кнопки Edit и Delete и кнопку плюс в Top
    @onInfoRow - по кнопке Инфо
    @onBtnDelete - кнопка удалить в строке
    @onBtnEdit - кнопка едит в строке
    @onRowClick - по строке
    @onAdd - кнопка плюс в заголовке
    :iconBtnEdit="" - иконка для редактирования
    :iconBtnDelete="" - иконка для удаления
    :rowsPerPage - кол-во строк таблице - странице
