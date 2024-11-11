import psutil
from vx_root import root_feature, ContextMenu, root_content

feature = root_feature()
content = root_content()

feature.init(
    {
        "title": "Test Bench",
        "frames": {
            "main": {
                "name": "Vixen",
                "route": "main",
            }
        },
    }
)


@content.dispatch("data")
def feature_title():
    return feature.params.get_value("title")


@content.dispatch("menu")
def menu_test():
    menu_test: ContextMenu = {
        "Menu item 1": {"entry": lambda: print("Click on menu item 1")},
        "Menu item 2": {"entry": lambda: print("Click on menu item 2")},
        "Sub Menu 1": {
            "entry": {
                "Sub menu item 1": {"entry": lambda: print("Click on sub menu item 1")},
                "Sub menu item 2": {"entry": lambda: print("Click on sub menu item 2")},
            }
        },
    }

    return menu_test


@content.dispatch("data")
def hello(name: str = ""):
    return f"Hello {name}!!!"


@content.dispatch("data")
def good_bye():
    return "Good bye !!!"


@content.dispatch("data")
def cpu_usage(percpu: bool = False) -> float | list[float]:
    return psutil.cpu_percent(percpu=percpu)


@content.dispatch("data")
def ram_usage() -> float:
    return psutil.virtual_memory().percent


@content.dispatch("task")
def print_hello(name: str = ""):
    print(f"Hello {name}!!!")
