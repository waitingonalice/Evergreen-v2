import asyncio
import json
import platform

import psutil
from app.db import utils
from app.models.system import SystemInfoModel


# Get system information ()
async def main():
    system_info = SystemInfoModel()
    try:
        while True:
            device_name = platform.node()
            cpu_name = platform.processor()
            cpu_count = psutil.cpu_count()
            cpu_usage_percent = psutil.cpu_percent()
            _, min, max = psutil.cpu_freq()
            cpu = {
                "name": cpu_name,
                "count": cpu_count,
                "min": min,
                "max": max,
                "usage": cpu_usage_percent,
            }
            stringified_cpu = json.dumps(cpu)
            total_mem, available_mem, _, _, _, _, _, _ = (
                psutil.virtual_memory()
            )
            ram = {
                "total": total_mem,
                "available": available_mem,
            }
            stringified_mem = json.dumps(ram)
            utils.transaction(
                lambda conn: system_info.insert_info(
                    conn, device_name, stringified_cpu, stringified_mem
                )
            )
            await asyncio.sleep(delay=60)
    except KeyboardInterrupt:
        print("Exiting...")
        return

    except Exception as e:
        print(f"An error occurred: {e}")
        return


if __name__ == "__main__":
    asyncio.run(main())
