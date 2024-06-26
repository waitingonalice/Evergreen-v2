"""empty message

Revision ID: 0632bb966692
Revises: ab962241043e
Create Date: 2024-05-02 17:26:27.133274

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0632bb966692'
down_revision: Union[str, None] = 'ab962241043e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('FileRecord',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('path', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('account_id', sa.UUID(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['Account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('Resume',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('content', sa.Text(), nullable=True),
    sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('file_record_id', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['file_record_id'], ['FileRecord.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Resume')
    op.drop_table('FileRecord')
    # ### end Alembic commands ###
