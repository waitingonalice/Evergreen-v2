import json

from ...models.system import SystemInfoModel
from ...utils.formatting import convert_bytes


class SystemInfoService:
    def get_latest_info(self):
        system_info = SystemInfoModel().list_latest_info()

        def format_info(info: dict):
            parse_cpu: dict = json.loads(info["cpu"])
            parse_memory: dict = json.loads(info["memory"])
            total_mem = parse_memory["total"]
            available_mem = parse_memory["available"]
            mem_usage = total_mem - available_mem
            mem_usage_percentage = int(mem_usage / total_mem * 100)

            parse_memory.update(
                {
                    "available": convert_bytes(available_mem, "gb").__round__(
                        1
                    ),
                    "total": convert_bytes(total_mem, "gb").__round__(1),
                    "usage": convert_bytes(mem_usage, "gb").__round__(1),
                    "usage_percentage": mem_usage_percentage,
                }
            )

            return {
                "device_name": info["device_name"],
                "cpu": parse_cpu,
                "memory": parse_memory,
            }

        data = [format_info(info) for info in system_info]
        return {"result": data}
