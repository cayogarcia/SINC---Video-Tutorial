from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c367a53978ce'
down_revision: Union[str, None] = '13d0dd9bd208'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: adiciona coluna login à tabela users."""
    op.add_column('users', sa.Column('login', sa.String(length=255), nullable=True))


def downgrade() -> None:
    """Downgrade schema: remove coluna login da tabela users."""
    op.drop_column('users', 'login')

