"""empty message

Revision ID: 7717163b0b14
Revises: c3981a8059d7
Create Date: 2024-06-01 14:12:14.305359

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7717163b0b14'
down_revision: Union[str, None] = 'c3981a8059d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('FileRecord', sa.Column('type', sa.String(), nullable=True))
    op.create_index(op.f('ix_FileRecord_filename'), 'FileRecord', ['filename'], unique=False)
    op.create_index(op.f('ix_FileRecord_status'), 'FileRecord', ['status'], unique=False)
    op.create_index(op.f('ix_FileRecord_type'), 'FileRecord', ['type'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_FileRecord_type'), table_name='FileRecord')
    op.drop_index(op.f('ix_FileRecord_status'), table_name='FileRecord')
    op.drop_index(op.f('ix_FileRecord_filename'), table_name='FileRecord')
    op.drop_column('FileRecord', 'type')
    # ### end Alembic commands ###
