import sys
from django.db.models import Q


def and_search_filter(get, value_requests: list, value_db: list):
    """Возвращает фильтр для модели"""
    filter = Q()
    for key_value, key_db in zip(value_requests, value_db):
        value = get.get(key_value)
        if value:
            filter &= Q(**{f'{key_db}__icontains': value})
    return filter


def and_search(model, get, value_requests: list, value_db: list):
    """поиск через И (Q) и совпадением имени (__icontains)"""
    if not get:
        return model.objects.all()  # если нет параметров, просто возвращаем все посты
    else:
        filters = Q()
        for key_value, key_db in zip(value_requests, value_db):
            value = get.get(key_value)
            if value:
                filters &= Q(**{f'{key_db}__icontains': value})
        return model.objects.filter(filters)


def exact_and_search(model, get, value_requests: list, value_db: list):
    """поиск через И (Q) и точном соответствии по pk"""
    if not get:
        return model.objects.all()  # если нет параметров, просто возвращаем все посты
    else:
        filters = Q()
        for key_value, key_db in zip(value_requests, value_db):
            value = get.get(key_value)
            if isinstance(value, str):  # Если значение строка, применяем обычное равенство
                filters &= Q(**{f'{key_db}': value})
            elif isinstance(value, list):  # Если значение список, применяем оператор IN
                filters &= Q(**{f'{key_db}__in': value})
        return model.objects.filter(filters)


def print_size(queryset):
    objects_list = list(queryset)
    total_size = sum(sys.getsizeof(obj) for obj in objects_list)
    print(f"Общий размер объектов: {total_size} байт")