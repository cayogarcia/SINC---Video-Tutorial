from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '13d0dd9bd208'
down_revision: Union[str, None] = 'e88e39a80e03'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('videos', sa.Column('deleted', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('videos', 'deleted')

