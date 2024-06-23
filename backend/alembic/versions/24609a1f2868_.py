"""empty message

Revision ID: 24609a1f2868
Revises: 7717163b0b14
Create Date: 2024-06-09 14:13:26.823133

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "24609a1f2868"
down_revision: Union[str, None] = "7717163b0b14"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "SystemInfo",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("device_name", sa.String(), nullable=True),
        sa.Column("cpu", sa.Text(), nullable=True),
        sa.Column("memory", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "SelfHosted",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("url", sa.String(), nullable=True),
        sa.Column("account_id", sa.UUID(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["account_id"],
            ["Account.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "Monitoring",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("interval", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("self_hosted_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["self_hosted_id"],
            ["SelfHosted.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("self_hosted_id"),
    )
    op.create_table(
        "MonitoringHTTP",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("method", sa.String(), nullable=False),
        sa.Column("header", sa.Text(), nullable=True),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("min_status_code", sa.Integer(), nullable=True),
        sa.Column("monitoring_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["monitoring_id"],
            ["Monitoring.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("monitoring_id"),
    )
    op.create_table(
        "MonitoringPing",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("hostname", sa.String(), nullable=False),
        sa.Column("monitoring_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["monitoring_id"],
            ["Monitoring.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("monitoring_id"),
    )
    op.create_table(
        "MonitoringPostgres",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("connection_string", sa.String(), nullable=False),
        sa.Column("query", sa.Text(), nullable=False),
        sa.Column("monitoring_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["monitoring_id"],
            ["Monitoring.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("monitoring_id"),
    )
    op.create_table(
        "Notifications",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("message", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("monitoring_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["monitoring_id"],
            ["Monitoring.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "NotificationEmail",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("notification_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["notification_id"],
            ["Notifications.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "NotificationTelegram",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("chat_id", sa.String(), nullable=False),
        sa.Column("token", sa.String(), nullable=False),
        sa.Column("notification_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["notification_id"],
            ["Notifications.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column("FileRecord", sa.Column("filetype", sa.String(), nullable=True))
    op.execute(
        """
               UPDATE "FileRecord" SET filetype = 'application/pdf'
               """
    )
    op.add_column("FileRecord", sa.Column("self_hosted_id", sa.UUID(), nullable=True))
    op.create_foreign_key(
        "SH_FR", "FileRecord", "SelfHosted", ["self_hosted_id"], ["id"]
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("SH_FR", "FileRecord", type_="foreignkey")
    op.drop_column("FileRecord", "self_hosted_id")
    op.drop_column("FileRecord", "filetype")
    op.drop_table("NotificationTelegram")
    op.drop_table("NotificationEmail")
    op.drop_table("Notifications")
    op.drop_table("MonitoringPostgres")
    op.drop_table("MonitoringPing")
    op.drop_table("MonitoringHTTP")
    op.drop_table("Monitoring")
    op.drop_table("SelfHosted")
    op.drop_table("SystemInfo")
    # ### end Alembic commands ###