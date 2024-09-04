import asyncio
from fastapi import WebSocket
from vx_root import root_content, utils
from vx_hyprland import HyprEvents


class WindowsHandler(utils.SocketHandler):
    def __init__(self, websocket: WebSocket) -> None:
        super().__init__(websocket)

    def on_activewindow(self, data):
        asyncio.create_task(
            self.websocket.send_json({"id": "activewindow", "data": data})
        )

    async def on_opening(self):
        HyprEvents.add_listener("activewindow", self.on_activewindow)

    async def on_closing(self):
        HyprEvents.remove_listener("activewindow", self.on_activewindow)


@root_content().dispatch("socket")
def activewindow(websocket: WebSocket):
    return WindowsHandler(websocket)
