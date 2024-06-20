import json

from ...models.system import SystemInfoModel


class MonitoringService:
    def get_latest_hardware_info(self):
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
                    "available": available_mem,
                    "total": total_mem,
                    "usage": mem_usage,
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

    def save_hardware_info(self, data: dict):
        pass

    def save_selfhosted_app(self, data: dict):
        pass

    def list_self_hosted_apps(self):
        pass

    def get_self_hosted_app(self, id: str):
        pass
