from vx_root import root_feature, root_content
from vx_system import SysInfos
from vx_hyprland import HyprInfos, HyprEvents

from . import windows_socket
from . import workspaces_socket

feature = root_feature()
content = root_content()

feature.init(
    {
        "frames": {
            "main": {
                "name": "Vixen Panel",
                "route": "main",
                "layer_frame": {
                    "height": [32, 64],
                    "anchor_edge": ["top", "bottom"],
                    "alignment": "stretch",
                    "auto_exclusive_zone": True,
                    "level": "top",
                    "margins": {
                        "top": 4,
                        "left": 10,
                        "right": 10,
                        "bottom": 4,
                    },
                },
            }
        },
        "state": "disable",
    }
)

feature.set_required_features(["vx_system", "vx_hyprland"])

content.dispatch("data")(SysInfos.cpu_usage)
content.dispatch("data")(SysInfos.ram_usage)

monitor_names: list[str] = None


def on_focused_monitor(data: dict):
    global monitor_names

    feature.params.set_value(
        "frames.main.layer_frame.monitor_id", monitor_names.index(data["monitor_name"])
    )


@feature.on_startup
def on_startup():
    global monitor_names

    monitor_names = [d["name"] for d in HyprInfos.monitors()]

    feature.params.set_value(
        "frames.main.layer_frame.monitor_id",
        HyprInfos.activeworkspace()["monitorID"],
    )

    HyprEvents.add_listener("focusedmon", on_focused_monitor)
    return True


@feature.on_shutdown
def on_shutdown():
    HyprEvents.remove_listener("focusedmon", on_focused_monitor)
    return True
