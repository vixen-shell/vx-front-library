import asyncio
from fastapi import WebSocket
from vx_hyprland import HyprInfos, HyprEvents
from vx_root import root_content, utils


def workspaces_by_monitor_id(monitor_id: int) -> list[dict]:
    return [d for d in HyprInfos.workspaces() if d["monitorID"] == monitor_id]


def monitor_ids(monitor_name: str) -> dict[str, int]:
    return {d["name"]: d["id"] for d in HyprInfos.monitors()}.get(monitor_name)


class WorkspacesHandler(utils.SocketHandler):
    def __init__(self, websocket: WebSocket) -> None:
        super().__init__(websocket)

        active_workspace_data = HyprInfos.activeworkspace()

        self.active_workspace_name: str = active_workspace_data["name"]
        self.active_monitor_id: int = active_workspace_data["monitorID"]

    def send_data(self):
        workspaces = workspaces_by_monitor_id(self.active_monitor_id)

        asyncio.create_task(
            self.websocket.send_json(
                {
                    "id": "workspace_count",
                    "data": {
                        "active_monitor_id": self.active_monitor_id,
                        "active_workspace_name": (
                            "1"
                            if self.active_workspace_name == True
                            else self.active_workspace_name
                        ),
                        "workspaces_length": len(workspaces),
                        "workspace_names": [d["name"] for d in workspaces],
                    },
                }
            )
        )

    def on_workspace(self, data):
        self.active_workspace_name = data["workspace_name"]
        self.send_data()

    def on_focused_monitor(self, data):
        self.active_workspace_name = data["workspace_name"]
        self.active_monitor_id = monitor_ids(data["monitor_name"])
        self.send_data()

    async def on_opening(self):
        HyprEvents.add_listener("workspace", self.on_workspace)
        HyprEvents.add_listener("focusedmon", self.on_focused_monitor)
        self.send_data()

    async def on_closing(self):
        HyprEvents.remove_listener("workspace", self.on_workspace)
        HyprEvents.remove_listener("focusedmon", self.on_focused_monitor)


@root_content().dispatch("socket")
def workspaces(websocket: WebSocket):
    return WorkspacesHandler(websocket)
